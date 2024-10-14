import React, { useEffect } from 'react';
import './Index.css'
import bgError from '../../../assets/img/general/bg-error.png';
import { clearGameInterval } from '../GameContentModal/GameContentSlice';
import { showErrorAndResult } from './ErrorSlice';
import { useSelector, useDispatch } from 'react-redux';


const ErrorModal = () => {
    const dispatch = useDispatch();
    const showErrorModal = useSelector((state) => state.errorModal.showErrorModal);

    useEffect(() => {
        if (showErrorModal) {
            dispatch(clearGameInterval());
            // Ẩn modal thông báo lỗi sau 3 giây và hiển thị kết quả game
            setTimeout(() => {
                dispatch(showErrorAndResult());
            }, 3000);

        }
    }, [showErrorModal, dispatch]);

    if (!showErrorModal) return null;

    return (
        <div className="false-clicked-modal" style={{ display: showErrorModal ? 'flex' : 'none' }}>
            <img src={bgError} alt="false-clicked"
                className="false-clicked-img" />
        </div>
    );
}

export default ErrorModal;
