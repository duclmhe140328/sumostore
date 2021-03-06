import React, { useState, useEffect, useContext } from 'react'
import { useForm } from "react-hook-form";
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { UserContext } from '../UserContext/UserContext'
import Axios from 'axios'

import './AddVehicle.css'

const api = 'https://61bff171b25c3a00173f4f80.mockapi.io/api/vehicles';
const apiImage = 'https://api.cloudinary.com/v1_1/sumoshop/image/upload';

const AddVehicle = ({ index }) => {
    const { user } = useContext(UserContext);
    const [image, setImage] = useState();
    const [imageSelected, setImageSelected] = useState();
    const [newDate, setNewDate] = useState();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
        const active = document.querySelectorAll('.nav-link')
        active[index].classList.add('active')
        const newDate = () => {
            const date = new Date();
            const times = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            setNewDate(times)
        }
        newDate();
        return () => {
            image && URL.revokeObjectURL(image.preview)
            document.querySelector('.nav-link.active').classList.remove('active')
        }
    }, [image, index])

    // review Image
    const handleImageChange = (data) => {
        if (data) {
            setImageSelected(data)
            const img = data
            img.preview = URL.createObjectURL(data)
            setImage(img)
        } else {
            setImage()
        }
    }


    const onSubmit = (data) => {
        const type = data.productType;
        data.createdDate = newDate;

        // Create form to upload Cloudinary
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "sumostore");

        // Upload image to Cloudinary
        Axios.post(apiImage, formData)
            .then(response => {
                // Assign data to Cloudinary image URL
                data.image = response.data.secure_url

                // Post data to Api
                Axios.post(`${api}/${type}`, data)
                    .catch(err => alert('C?? l???i x???y ra'))
            })
            .catch(err => alert('C?? l???i x???y ra'))
        setImage()
        alert('????ng b??n th??nh c??ng')
        reset()
    }

    return (
        <div className="add-vehicle">
            <div className="container">
                {user && user.auth ? (
                    <div className="row justify-content-center">
                        <Form className="row add__container" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3 col-md-6" name="seller">
                                <Form.Label className="add__label">Ng?????i b??n</Form.Label>
                                <Form.Control
                                    className="add__input"
                                    type="text"
                                    // placeholder={user.name}
                                    value={user.username}
                                    {...register("seller")}
                                    readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" name="name">
                                <Form.Label className="add__label">T??n m???t h??ng*</Form.Label>
                                <Form.Control className="add__input" type="text" placeholder="..." {...register("name", { required: true })} />
                                {errors.name && <span className="text-danger">Vui l??ng nh???p tr?????ng n??y</span>}
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" name="price">
                                <Form.Label className="add__label">Gi??*</Form.Label>
                                <Form.Control className="add__input" type="text" placeholder="...USD, ...VN??, Th???a thu???n" {...register("price", { required: true })} />
                                {errors.price && <span className="text-danger">Vui l??ng nh???p tr?????ng n??y</span>}
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" name="address">
                                <Form.Label className="add__label">N??i b??n*</Form.Label>
                                <Form.Select {...register("address", { required: true })}>
                                    <option value="">T???nh/Tp</option>
                                    <option value="H?? N???i">H?? N???i</option>
                                    <option value="Ninh B??nh">Ninh B??nh</option>
                                    <option value="Thanh H??a">Thanh H??a</option>
                                    <option value="Ngh??? An">Ngh??? An</option>
                                </Form.Select>
                                {errors.address && <span className="text-danger">Vui ch???n n??i b??n</span>}
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" name="phone">
                                <Form.Label className="add__label">S??? ??i???n tho???i li??n h???*</Form.Label>
                                <Form.Control className="add__input" type="text" placeholder="S??? ??i???n tho???i..." {...register("phone", { required: true })} />
                                {errors.phone && <span className="text-danger">Vui l??ng nh???p tr?????ng n??y</span>}
                            </Form.Group>
                            <Form.Group name="image" className="mb-3 col-md-6">
                                <Form.Label className="add__label">???nh m?? t???*</Form.Label>
                                <Form.Control className="add__input" type="file" {...register("image", { required: true })} onChange={e => handleImageChange(e.target.files[0])} />
                                {errors.image && <span className="text-danger">Vui l??ng ch???n ???nh m?? t???</span>}
                            </Form.Group>
                            {image && <img src={image.preview} alt="???nh m?? t???" className="mt-3 col-md-6" />}
                            <Form.Label className="add__label">Lo???i xe*</Form.Label>
                            <Form.Group className="mb-3" name="productType">
                                <Form.Select {...register("productType", { required: true })} aria-label="Default select example">
                                    <option value="">Ch???n lo???i xe</option>
                                    <option value="motorbikes">Xe m??y m???i</option>
                                    <option value="oldmotors">Xe m??y c??</option>
                                    <option value="newcars">?? t?? m???i</option>
                                    <option value="oldcars">?? t?? c??</option>
                                </Form.Select>
                            </Form.Group>
                            {errors.productType && <span className="text-danger">Vui l??ng ch???n lo???i xe</span>}
                            <FloatingLabel className="add__description mt-3" name="description" label="M?? t???">
                                <Form.Control
                                    className="add__input"
                                    {...register("description")}
                                    as="textarea"
                                    placeholder="Th??m m?? t??? t???i ????y"
                                    style={{ height: '80px' }}
                                />
                            </FloatingLabel>
                            <Button className="add__btn mt-3" variant="primary" type="submit">
                                ????ng b??n ngay!!
                            </Button>
                        </Form>
                    </div>
                ) : (
                    <h1
                        style={{
                            zIndex: 3,
                            textAlign: 'center',
                            color: '#000'
                        }}
                    >Vui l??ng ????ng nh???p ????? th???c hi???n ch???c n??ng n??y</h1>
                )}
            </div>
        </div>
    )
}

export default AddVehicle
