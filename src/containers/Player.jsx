import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getVideoSource } from '../actions';
import { Redirect } from 'react-router-dom';
import '../assets/styles/components/Player.scss';

const Player = props => {
    const { id } = props.match.params;
    const [loading, setLoading] = useState(true);
    const hasPlaying = Object.keys(props.playing).length > 0;

    useEffect(() => {
        props.getVideoSource(id);
        setLoading(false);
    }, []);

    return loading ? <h1>Cargando...</h1> : hasPlaying ? (
        <div className="Player">
            <video controls autoPlay>
                <source src={props.playing.source} type="video/mp4" />
            </video>
            <div className="Player-back">
                <button type="button" onClick={() => props.history.goBack()}>
                    Regresar
                </button>
            </div>
        </div>
    ) : <Redirect to="/404/" />;
};

const mapStateToProps = state => {
    return {
        playing: state.playing,
    }
};

const mapDispatchToProps = {
    getVideoSource,
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);