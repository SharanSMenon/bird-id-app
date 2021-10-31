import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import { checkIfSpeciesRecentlyHere, createObservations, getCommmonNames, getObservationsOfSpecies, getTaxonData, speciesLivesHere } from "../data/inat";
import InfoModal from "./InfoModal";

export default function PredictionList(props) {
    const [loading, setLoading] = React.useState(true);
    const [commonNames, setCommonNames] = React.useState([]);
    const [modalData, setModalData] = React.useState(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalIsLoading, setModalIsLoading] = React.useState(Array(5).fill(false));

    React.useEffect(() => {
        setLoading(true);
        getCommmonNames(props.predictions).then(names => {
            setCommonNames(names);
            setLoading(false);
        })
    }, [props.predictions]);

    const onClick = async (e, idx) => {
        const modalLoading = Array(5).fill(false);
        modalLoading[idx] = true;
        setModalIsLoading(modalLoading); 
        const scientificName = props.predictions[idx]
        const taxonData = await getTaxonData(scientificName);
        const data = {
            ...taxonData,
            locationBased: false
        }
        if (props.position) {
            const seenHere = await checkIfSpeciesRecentlyHere(scientificName, props.position);
            const recentObservations = await getObservationsOfSpecies(scientificName, props.position);
            data.locationBased = true;
            data.seenHere = seenHere;
            data.livesHere = speciesLivesHere(scientificName, recentObservations);
            data.recentObservations = createObservations(recentObservations);
            data.rawObservations = recentObservations;
        }
        if (taxonData["photo"] != null) {
            data.imageURL = taxonData["photo"]["medium_url"]
        }
        setModalData(data);
        setModalIsOpen(true);
        setModalIsLoading(Array(5).fill(false));

    }
    const onClose = () => {
        setModalIsOpen(false);
        setModalData(null);
    }
    return (
        <div>
            {(props.predictions.length > 0 && !loading) && (<ListGroup>
                {commonNames.map((prediction, idx) => (
                    <ListGroup.Item key={idx} variant={idx === 0 ? "success" : ""}
                        className="d-flex justify-content-between align-items-start"
                        onClick={(e) => {
                            onClick(e, idx)
                        }}>
                        <div>
                        {prediction}
                        </div>
                        {modalIsLoading[idx] && <Spinner animation="border" height="10px"/>}
                    </ListGroup.Item>
                ))}
            </ListGroup>)
            }
            {(props.predictions.length > 0 && loading) && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
            {(modalIsOpen && modalData) &&
                (<InfoModal isOpen={modalIsOpen} onClose={onClose} data={modalData} position={props.position} />)}
        </div>
    );
}