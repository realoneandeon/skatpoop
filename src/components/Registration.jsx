import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Registration() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    institute: '',
    course: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const API_URL = 'http://localhost:8080/api';

  const institutes = [
    { value: 'mai', label: 'МАИ (Московский авиационный институт)' },
    { value: 'mgu', label: 'МГУ (Московский государственный университет)' },
    { value: 'spbgu', label: 'СПбГУ (Санкт-Петербургский государственный университет)' },
    { value: 'mfti', label: 'МФТИ (Московский физико-технический институт)' },
    { value: 'bauman', label: 'МГТУ им. Баумана' }
  ];

  const courses = [
    { value: '1', label: '1 курс' },
    { value: '2', label: '2 курс' },
    { value: '3', label: '3 курс' },
    { value: '4', label: '4 курс' }
  ];

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.institute) {
      newErrors.institute = 'Выберите институт';
    }

    if (!formData.course) {
      newErrors.course = 'Выберите курс';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
          setShowSuccess(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setErrors({ 
          submit: 'Ошибка при регистрации. Попробуйте позже.' 
        });
      }
    }
  };

  return (
    <div className="registration-container">
      {showSuccess ? (
        <div className="success-modal">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Регистрация успешна!</h2>
          <p>Ваша учетная запись создана.</p>
        </div>
      ) : (
        <>
          <img src={logo} alt="Logo" className="logo" />
          <h1>Регистрация</h1>
          
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

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите пароль"
                className="form-control"
              />
              {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <select
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Выберите институт</option>
                {institutes.map(inst => (
                  <option key={inst.value} value={inst.value}>
                    {inst.label}
                  </option>
                ))}
              </select>
              {errors.institute && <div className="error">{errors.institute}</div>}
            </div>

            <div className="form-group">
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Выберите курс</option>
                {courses.map(course => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
              {errors.course && <div className="error">{errors.course}</div>}
            </div>

            {errors.submit && <div className="error">{errors.submit}</div>}

            <button type="submit" className="submit-button">
              Зарегистрироваться
            </button>

            <div className="auth-link">
              Уже зарегистрированы? <Link to="/login">Войти</Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Registration;