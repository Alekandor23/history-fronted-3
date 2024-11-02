import { FaStar } from 'react-icons/fa';
import { postUserReview } from '../service/api';
import { useState } from 'react';
import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, userID, bookID }) => {
    if (!isOpen) return null;
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('')
    const [reviewText, setReviewText] = useState("");// Estado para el contenido de la reseña

    // Función para manejar la cancelación
    const Cancelar = () => {
        setRating(0); // Reiniciar estrellas
        setReviewText(""); // Limpiar texto de la reseña
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await postUserReview(userID, bookID, reviewText, rating);
            setMessage(respuesta.response.data.message || 'Reseña creada exitosamente');
            console.log('Reseña Creada:', respuesta);
        } catch (error) {
            setMessage('Error al crear reseña');
            console.error('Error al escribir reseña:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="modal-overlay " onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span id="close-btn" onClick={onClose}>&times;</span>
                {/*empiezo de los contenedores del adentro*/}
                <div className='comentario-contenedor'>
                    <h1 className='titulo-reseña'>Tu reseña</h1>
                    <div className='usuario-contenedor'>
                        <div className='rating'>
                            <i class="bi bi-person-circle" id='circulo-user'></i>
                            <p>Tu usuario</p>{/*Aqui viene el nombre del usuario*/}
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} />
                                        <FaStar className="star" color={ratingValue <= rating ? 'gold' : 'darkgray'} size={34} />
                                    </label>
                                );
                            })}
                        </div>
                        <div className='escribir-contenedor px-5'>
                            <input type="text" className="escribir-control"
                                placeholder="Escribir Reseña (Opcional)"
                                value={reviewText} // Valor del estado
                                onChange={(e) => setReviewText(e.target.value)} />
                            <div className="botones-contenedor">
                                <button className="btn-cancelar" onClick={Cancelar}>Cancelar</button>
                                <button className="btn-publicar" onClick={handleSubmit}>Publicar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Modal;