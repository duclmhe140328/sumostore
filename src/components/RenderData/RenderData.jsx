import React, { useState, useEffect, useRef, useContext } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { UserContext } from '../UserContext/UserContext';
import { FavoritesContext } from '../FavoritesContext/FavoritesContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import RingLoader from "react-spinners/RingLoader";
import DetailModal from "../DetailModal/DetailModal"
import MoreBtn from '../MoreBtn/MoreBtn';
import Axios from 'axios';

import './RenderData.css';


const RenderData = ({ type, index }) => {
    const api = 'https://61bff171b25c3a00173f4f80.mockapi.io/api/vehicles'
    const [vehicles, setVehicles] = useState();
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(true);
    const [info, setInfo] = useState();
    const [filter, setFilter] = useState();
    const [errorsMessage, setErrorMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(12);

    const { user } = useContext(UserContext);
    const { favorites, handleFavorites, handleDeleteFavorites } = useContext(FavoritesContext);

    const selectProvince = useRef();
    // const sortBy = useRef();

    //handleModal
    const handleClose = () => setShow(false);
    const handleShow = (data) => {
        setShow(true);
        setInfo(data);
    };

    // get data
    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
        setVehicles()
        setFilter()
        setCurrentPage(1)
        const fetchData = () => {
            Axios.get(`${api}/${type}`)
                .then((res) => {
                    setVehicles(res.data.sort((a, b) => b.id - a.id))
                    setFilter(res.data.sort((a, b) => b.id - a.id))
                })
                .catch(() => setErrorMessage(true))
        }
        fetchData();

        selectProvince.current.value = 'all'

        const active = document.querySelectorAll('.nav-link')
        active[index].classList.add('active')
        return () => {
            document.querySelector('.nav-link.active').classList.remove('active')
        }
    }, [type, index])

    // delete vehicle
    const handleDelete = (id) => {
        // delete vehicle on Api
        Axios.delete(`${api}/${type}/${id}`)
            .then(response => {
                alert("???? x??a m???t h??ng")
                window.location.reload()
            })
            .catch((e) => {
                alert('???? x???y ra l???i, vui l??ng t???i l???i trang')
            })
    }

    // filter vehicle
    const handleFilter = (e) => {
        const listVehicles = vehicles.filter(vehicle => vehicle.address === e)
        setFilter(listVehicles)
        if (e === 'all') {
            setFilter(vehicles)
        }
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const currentPosts = filter && filter.slice(0, indexOfLastPost)

    const handlePageClickMore = () => {
        setLoad(false)
        setTimeout(() => {
            setLoad(true)
            setCurrentPage(currentPage + 1)
        }, 1300);
    }
    const handlePageClickCollapse = () => {
        setCurrentPage(1)
    }

    return (
        <div className="bg-dark vehicle">
            <Container>
                <Row className="mt-3">
                    <Col className="d-flex" md={8}>
                        <p className="text-white filter__title">Ch???n t???nh th??nh:</p>
                        <Form.Select
                            ref={selectProvince}
                            className="filter__box"
                            type="text" placeholder="T???nh/TP..."
                            onChange={e => handleFilter(e.target.value)}
                        >
                            <option value="all">T???t c???</option>
                            <option value="H?? N???i">H?? N???i</option>
                            <option value="Ninh B??nh">Ninh B??nh</option>
                            <option value="Ngh??? An">Ngh??? An</option>
                            <option value="Thanh H??a">Thanh H??a</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row>
                    {(currentPosts && currentPosts.length > 0 &&
                        currentPosts.map((vehicle, index) =>
                            <div className="col-lg-4 col-md-6 vehicle__container" key={index}>
                                <Card className="vehicle__element">
                                    <div className="vehicle__img-link">
                                        <div className="vehicle__img-container" onClick={() => handleShow(vehicle)}>
                                            <Card.Img
                                                variant="top"
                                                className="vehicle__img"
                                                src={vehicle.image}
                                            />
                                            <button className="detail__btn">Chi ti???t</button>
                                        </div>
                                    </div>
                                    <Card.Body className="card__body">
                                        <Card.Title className="vehicle__title">{vehicle.name}</Card.Title>
                                        <div className="">
                                            <Card.Text className="vehicle__subtitle">Gi??: {vehicle.price}</Card.Text>
                                            <Card.Text className="vehicle__subtitle">N??i b??n: {vehicle.address}</Card.Text>
                                        </div>
                                        {user && user.username === 'admin' && <Button onClick={() => handleDelete(vehicle.id)}>X??a</Button>}

                                        {user && favorites && user.auth && ((!favorites.some(favorite => favorite.name === vehicle.name && favorite.price === vehicle.price && favorite.image === vehicle.image)
                                            &&
                                            <div className="fav-icon__container">
                                                <FontAwesomeIcon
                                                    icon={faHeart}
                                                    className="fav-icon"
                                                    onClick={() => handleFavorites(vehicle)}
                                                />
                                            </div>)
                                            ||
                                            <div className="fav-icon__container">
                                                <FontAwesomeIcon
                                                    icon={faHeart}
                                                    className="fav-icon active"
                                                    onClick={() => handleDeleteFavorites(vehicle)}
                                                />
                                            </div>)
                                        }
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                        ||
                        (currentPosts && currentPosts.length === 0 &&
                            <div className="sold-out">
                                <h1>M???c n??y hi???n kh??ng c?? h??ng vui l??ng quay l???i sau</h1>
                            </div>)
                        ||
                        ((errorsMessage &&
                            <div className="sold-out">
                                <h1>???? x???y ra l???i, vui l??ng t???i l???i trang</h1>
                            </div>
                        ) ||
                            (<div className="spinner">
                                <RingLoader color={"#A38D65"} size={70} />
                                <h3>Loading...</h3>
                            </div>)
                        )
                    }
                    <div className="d-flex justify-content-center">
                        <MoreBtn
                            currentPosts={currentPosts}
                            postsPerPage={postsPerPage}
                            filter={filter}
                            indexOfLastPost={indexOfLastPost}
                            handlePageClickMore={handlePageClickMore}
                            handlePageClickCollapse={handlePageClickCollapse}
                            load={load}
                        />
                    </div>
                    <DetailModal info={info} show={show} handleClose={handleClose} />
                </Row>
            </Container>
        </div>
    )
}

export default RenderData
