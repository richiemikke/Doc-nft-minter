import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Row } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";
import { useEffect, useState, useCallback } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const NftCard = ({ nft, nftTransfer, isOwner}) => {
  const { image, description, owner, name, index } = nft;
  const [newaddress, setnewAddress] = useState('');


  const handleTransfer = (newaddress)=>{
    nftTransfer(owner, newaddress, index);
}

  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1">{description}</Card.Text>

         
            <>
              <Form.Control
                className={"pt-2 mb-1"}
                type="text"
                placeholder="Enter new address"
                onChange={(e) => {
                  setnewAddress(e.target.value);
                }}
              />
             { isOwner ? (
             <Button
                variant="primary"
                onClick={() => handleTransfer(newaddress)}
              >
                Transfer
              </Button>
):(
  <Button
  variant="danger"
>
  You can't transfer
</Button>
)
}
            </>
          
        </Card.Body>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {

  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
