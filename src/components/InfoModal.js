import React from "react";
import { Modal, Accordion, ListGroup } from "react-bootstrap";
import BirdMap from "./BirdMap";
export default function InfoModal(props) {
    const { isOpen, onClose, data } = props;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                {data.wikipediaURL ?
                    (<Modal.Title><a href={data.wikipediaURL} target="_blank" rel="noreferrer">{data.commonName}</a></Modal.Title>) :
                    (<Modal.Title>{data.commonName}</Modal.Title>)
                }

            </Modal.Header>
            {data.imageURL && (<img src={data.imageURL} className="img-fluid" alt="Bird" />)}
            <Modal.Body>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Basic Info</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup>
                                <ListGroup.Item>Scientific Name: {data.scientificName}</ListGroup.Item>
                                {data.locationBased && (
                                    <div>
                                        <ListGroup.Item>{data.seenHere}</ListGroup.Item>
                                        <ListGroup.Item>{data.livesHere}</ListGroup.Item>
                                    </div>
                                )
                                }
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                    {data.locationBased && (
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Recent Observations</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    {(data.recentObservations.length > 2) && data.recentObservations.map((observation, index) => {
                                        return (<ListGroup.Item key={index}>
                                            <div className="me-auto">
                                                <div className="fw-bold">{observation.seenOn}</div>
                                                <small>{observation.location}</small>
                                            </div>
                                        </ListGroup.Item>)
                                    })}
                                    {data.recentObservations.length <= 2 && (<ListGroup.Item>No recent observations</ListGroup.Item>)}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                    {(data.locationBased && data.recentObservations.length > 2) && (
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Map of Recent Observations in your area</Accordion.Header>
                            <Accordion.Body>
                                <BirdMap position={props.position} observations={data.rawObservations}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                </Accordion>
            </Modal.Body>
        </Modal>
    )
}