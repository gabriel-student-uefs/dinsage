import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal, Button, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { API_URL, transactionTypes } from "../constants";
import AuthContext from "../context/AuthContext";
import { getUserProfile } from "../services/authService";

const EditTransactionModal = ({ transaction, onClose, onSave, token }) => {
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
  });
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [transactionTypeOptions, setTransactionsTypeOptions] = useState([]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
      });
    }
  }, [transaction]);

  useEffect(() => {
    const options =
      formData.type === "income"
        ? transactionTypes.income
        : transactionTypes.expense;

    if (Array.isArray(options)) {
      setTransactionsTypeOptions(options);
      if (options.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          category: options[0].name,
        }));
      }
    }
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (transaction && transaction.id) {
        await axios.patch(
          `${API_URL}/finance/transactions/${transaction.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios
          .post(`${API_URL}/finance/transactions/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            getUserProfile(token).then((data) => {
              setUser(data);
            });
          });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {transaction && transaction.id
            ? "Editar Transação"
            : "Criar Transação"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="loading-overlay">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <FloatingLabel
            controlId="formDescription"
            label="Nome"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </FloatingLabel>
          <FloatingLabel controlId="formType" label="Tipo" className="mb-3">
            <Form.Control
              as="select"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="income">Ganho</option>
              <option value="expense">Despesa</option>
            </Form.Control>
          </FloatingLabel>
          <FloatingLabel
            controlId="formCategory"
            label="Categoria"
            className="mb-3"
          >
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              disabled={loading}
            >
              {transactionTypeOptions &&
                transactionTypeOptions.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId="formAmount" label="Valor" className="mb-3">
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
            />
          </FloatingLabel>
          <div className="d-flex justify-content-end">
            <Button
              className="mx-2"
              variant="primary"
              type="submit"
              style={{
                borderColor: "#20c997",
                backgroundColor: "#20c997",
              }}
              size="sm"
              disabled={loading}
            >
              Salvar
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              style={{
                borderColor: "#d3557d",
                backgroundColor: "#d3557d",
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTransactionModal;
