import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:8080/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка входа');
        }

        const data = await response.json();
        if (data.success) {
          // Здесь можно добавить редирект на главную страницу
        } else {
          throw new Error(data.message || 'Ошибка входа');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrors({ 
          submit: error.message || 'Неверный email или пароль' 
        });
      }
    }
  };

  return (
    <div className="registration-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Вход</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите e-mail"
            className="form-control"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            className="form-control"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        {errors.submit && <div className="error">{errors.submit}</div>}

        <button type="submit" className="submit-button">
          Войти
        </button>

        <div className="auth-link">
          Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;