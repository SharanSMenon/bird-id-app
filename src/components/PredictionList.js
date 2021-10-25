import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

export default function PredictionList(props) {
    return (
        <div>
            {props.predictions.length > 0 && (<ListGroup>
                {props.predictions.map((prediction, idx) => (
                    <ListGroup.Item key={idx} variant={idx === 0 ? "success": ""}>
                        {prediction}
                    </ListGroup.Item>
                ))}
            </ListGroup>)
            }
        </div>
    );
}