import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/TechSupport.css';

const TechSupport = () => {
    const { slug } = useParams(); // Получаем slug из URL
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Словарь для отображения наименований регионов/стран на русском
    const regionNames = {
        kazakhstan: 'Казахстане',
        russia: 'России',
        batken: 'Баткенской области',
        chuy: 'Чуйской области',
        osh: 'Ошской области',
        'issyk-kul': 'Иссык-Кульской области',
        talas: 'Таласской области',
        jalalabad: 'Джалал-Абадской области',
        naryn: 'Нарынской области',
    };

    const slugPlace = regionNames[slug] || '';

    // Получение данных сотрудников из API
    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/employees/region/${slug}`);
                setStaff(response.data);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [slug]);

    // Обработка случая отсутствия данных сотрудников
    if (loading) return <p className="loading-message">Загрузка...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (staff.length === 0) return <h2 className="page-title">Сотрудники в {slugPlace} не найдены</h2>;

    return (
        <div className="container">
            <h1 className="page-title">Сотрудники технической поддержки в {slugPlace}</h1>
            <div className="staff-list">
                {staff.map((member, index) => (
                    <div key={index} className="staff-card">
                        <img
                            src={member.image || 'default_image_url.png'} // Установка изображения по умолчанию
                            alt={member.name}
                            className="staff-photo"
                        />
                        <div className="staff-info">
                            <h2 className="staff-name">{member.name}</h2>
                            <p className="staff-position">{member.position}</p>
                            <p className="staff-phone">{member.contact}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechSupport;
