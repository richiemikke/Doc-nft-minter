import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { Button } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  getNfts,
  createNft,
  fetchNftContractOwner,
  transferNFT,
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const NftList = ({minterContract, name}) => {

  /* performActions : used to run smart contract interactions in order
  *  address : fetch the address of the connected wallet
  */
  const {performActions, address} = useContractKit();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftOwner, setNftOwner] = useState(null);
  const [myDocs, setMyDocs] = useState(false);

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts(minterContract);
      if (!allNfts) return
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  const addNft = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createNft(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };



  const transfer = async (owneraddress, newaddress, tokenId) => {
    try {
      setLoading(true);

      await transferNFT(
        minterContract,
        performActions,
        owneraddress,
        newaddress,
        tokenId
      );

      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to transfer." />);
    } finally {
      setLoading(false);
    }
  };


  const fetchContractOwner = useCallback(async (minterContract) => {

    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, []);

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
        fetchContractOwner(minterContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets, fetchContractOwner]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
            <Button
                variant="link"
                onClick={() => {
                  setMyDocs(false);
                }}
              >
                <h1 className="fs-4 fw-bold mb-0 text-dark">{"All Documents"}</h1>{" "}
              </Button>

              <Button variant="link" onClick={() => setMyDocs(true)}>
                <h1 className="fs-4 fw-bold mb-0 text-dark">
                  {"My Documents"}
                </h1>{" "}
              </Button>

             
                  <AddNfts save={addNft} address={address}/>
          

            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">

              {/* display all NFTs */}
              {!myDocs
              ? nfts.map((_nft) => (
                  <Nft
                      key={_nft.index}
                      nftTransfer={transfer}
                      nft={{
                        ..._nft,

                      }}
                      isOwner={_nft.owner === address}
                  />
              ))
              : nfts.filter((_nft) => _nft.owner === address).map((_nft) => (
                <Nft
                key={_nft.index}
                nftTransfer={transfer}
                nft={{
                  ..._nft,

                }}
                isOwner={_nft.owner === address}
            />
              ))
            }
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {

  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;
