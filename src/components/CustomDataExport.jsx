import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";

const SWITCHES_PER_COLUMN = 10;

const ModalSection = styled.div`
  visibility: 1;
  opacity: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  transition: opacity 1s;
  z-index: 999;
`;

const ModalContainer = styled.div`
  max-width: 66%;
  min-height: 60%;
  max-height: 80%;
  margin: 100px auto;
  border-radius: 5px;
  width: 100%;
  position: relative;
  transition: all 2s ease-in-out;
  padding: 30px;
  background-color: #ffffff;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media screen and (max-width: 1024px) {
    min-width: 85%;
  }
`;

const CloseButton = styled(CloseIcon)`
  position: relative;
  color: #132353;
  cursor: pointer;
`;

const Title = styled.h2`
  position: relative;
`;

export const CustomDataExport = ({
  dataSet,
  titleText,
  columnsToShow = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [switchLabels, setSwitchLabels] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [allKeyObjects, setAllKeyObjects] = useState([]);

  useEffect(() => {
    if (showModal) makeAllKeysSelected();
  }, [showModal]);

  useEffect(() => {
    if (dataSet.length <= 0) return;

    makeAllKeysSelected();
    if (!allSelected) setSelectedKeys([]);
  }, [allSelected]);

  const makeAllKeysSelected = () => {
    let allKeys = [];
    for (const obj of dataSet) {
      let keys = [];
      if (columnsToShow.length > 0)
        keys = Object.keys(obj).filter((key) => columnsToShow.includes(key));
      else keys = Object.keys(obj);
      allKeys.push(
        ...keys.map((key) => {
          return { keyName: key, isChecked: allSelected, value: key };
        })
      );
    }

    const uniqueKeys = [
      ...new Map(allKeys.map((item) => [item["keyName"], item])).values(),
    ];
    if (allSelected) setSelectedKeys(uniqueKeys);
    setAllKeyObjects(uniqueKeys);
    const chunks = [...keyChunks(uniqueKeys, SWITCHES_PER_COLUMN)];
    setSwitchLabels(chunks);
  };

  function* keyChunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
  }

  const handleSelection = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (checked)
      setSelectedKeys((prev) => [
        ...prev,
        allKeyObjects.find((obj) => obj.keyName === value),
      ]);
    else setSelectedKeys((prev) => prev.filter((obj) => obj.keyName !== value));

    const updatedKeysList = allKeyObjects.map((obj) => {
      if (obj.keyName === value) {
        obj["isChecked"] = checked;
        return obj;
      }

      return obj;
    });
    const chunks = [...keyChunks(updatedKeysList, SWITCHES_PER_COLUMN)];
    setSwitchLabels(chunks);
  };

  const createSelectedKeyObjects = () => {
    return new Promise((resolve) => {
      const downloadArray = [];
      for (const obj of dataSet) {
        let newObj = {};
        selectedKeys.forEach((keyObj) => {
          const { keyName } = keyObj;
          newObj[keyName] = obj[keyName] ? obj[keyName] : "";
        });
        downloadArray.push(newObj);
      }

      resolve(downloadArray);
    });
  };

  const exportToCSV = async () => {
    const items = await createSelectedKeyObjects();
    const replacer = (key, value) => (value === null ? "" : value);
    const header = Object.keys(items[0]);
    const csv = [
      header.join(","),
      ...items.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

    let link = document.createElement("a");
    link.id = "lnkDwnldLnk";
    document.body.appendChild(link);
    const blob = new Blob([csv], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(blob);
    link.style.display = "none";
    link.href = csvUrl;
    link.download = "Custom Keys Export.csv";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSwitchLabels([]);
    setSelectedKeys([]);
    setAllKeyObjects([]);
    setAllSelected(false);
  };

  return (
    <>
      {showModal && (
        <ModalSection>
          <ModalContainer>
            <Grid
              container
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid item>
                <Title>
                  {titleText !== "" ? titleText : "Custom Columns Export"}
                </Title>
              </Grid>
              <Grid item sx={{ display: "flex", gap: "30px" }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => setAllSelected(!allSelected)}
                        value={allSelected}
                      />
                    }
                    label="Select All"
                  />
                </FormGroup>
                <CloseButton fontSize="large" onClick={handleModalClose} />
              </Grid>
            </Grid>
            {dataSet.length <= 0 && (
              <Grid
                container
                sx={{ display: "flex", justifyContent: "center" }}
                pt={3}
                pb={3}
              >
                <h3>No Data found!!!</h3>
              </Grid>
            )}
            <Grid container spacing={3}>
              {switchLabels.map((keySet, i) => {
                return (
                  <SwitchLabels
                    keyList={keySet}
                    key={i}
                    handleSelection={handleSelection}
                  />
                );
              })}
            </Grid>
            <Grid
              container
              sx={{ diplay: "flex", justifyContent: "flex-end" }}
              spacing={3}
              pt={3}
            >
              <Grid item>
                <Button
                  variant="contained"
                  disabled={dataSet.length <= 0 || selectedKeys.length <= 0}
                  onClick={exportToCSV}
                >
                  Export to CSV
                </Button>
              </Grid>
            </Grid>
          </ModalContainer>
        </ModalSection>
      )}

      <Grid
        container
        pb={1}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Grid item>
          <Button variant="contained" onClick={() => setShowModal(!showModal)}>
            Custom Export
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const SwitchLabels = ({ keyList, handleSelection }) => {
  return (
    <Grid item>
      <FormGroup>
        {keyList.map((key, i) => {
          const { keyName, value, isChecked } = key;
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={isChecked}
                  size="small"
                  onChange={handleSelection}
                  value={value}
                />
              }
              label={keyName}
              key={i}
            />
          );
        })}
      </FormGroup>
    </Grid>
  );
};
