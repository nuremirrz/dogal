import React, { useState, useEffect } from "react";
import { Form, Input, Button, Table, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const NewsletterAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Загрузка списка подписчиков
  const fetchSubscribers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subscribers/all");
      const data = await response.json();
      setSubscribers(data);
      setFilteredSubscribers(data); // Изначально показываем всех подписчиков
    } catch (error) {
      console.error("Ошибка загрузки подписчиков:", error);
      message.error("Не удалось загрузить подписчиков.");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Фильтрация подписчиков по email
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(value)
    );
    setFilteredSubscribers(filtered);
  };

  // Отправка рассылки
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/subscribers/send-newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            adminToken: "YOUR_ADMIN_TOKEN", // Замените на ваш токен
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        message.success("Рассылка успешно отправлена!");
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Ошибка при отправке рассылки.");
      }
    } catch (error) {
      message.error("Ошибка сети. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  };

  // Удаление подписчика
  const handleDelete = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subscribers/unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        message.success("Подписчик успешно удален.");
        fetchSubscribers(); // Обновляем список
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Ошибка при удалении подписчика.");
      }
    } catch (error) {
      message.error("Ошибка сети. Проверьте соединение.");
    }
  };

  // Колонки таблицы
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Дата подписки",
      dataIndex: "subscribedAt",
      key: "subscribedAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.email)}
        />
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Массовая рассылка</h2>
      <Form onFinish={onFinish} layout="vertical" className="mb-8">
        <Form.Item
          label="Тема письма"
          name="subject"
          rules={[{ required: true, message: "Введите тему письма!" }]}
        >
          <Input placeholder="Введите тему письма" />
        </Form.Item>
        <Form.Item
          label="Текст письма"
          name="text"
          rules={[{ required: true, message: "Введите текст письма!" }]}
        >
          <Input.TextArea rows={6} placeholder="Введите текст письма" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Отправить рассылку
          </Button>
        </Form.Item>
      </Form>

      <div className="mb-4">
        <Input
          placeholder="Поиск по email"
          value={searchValue}
          onChange={handleSearch}
          className="mb-4"
        />
      </div>

      <h3 className="text-xl font-bold mb-4">Список подписчиков</h3>
      <Table
        dataSource={filteredSubscribers}
        columns={columns}
        rowKey="email"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default NewsletterAdmin;
