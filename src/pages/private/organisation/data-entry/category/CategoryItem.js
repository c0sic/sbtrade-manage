import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import "../../../../../styles/UserItem.css";
import APP_STRINGS from "../../../../../util/strings";

const CategoryItem = ({ category, updateCategoriesList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCategory, setEditCategory] = useState(category.text);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setEditCategory(category.text);
    setIsEditMode(false);
  };

  const handleApplyClick = async () => {
    try {
      const categoryDoc = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("activityDescriptions")
        .doc(category.id);

      await categoryDoc.update({
        text: editedCategory,
      });

      setIsEditMode(false);
      updateCategoriesList(category.id, { text: editedCategory });
    } catch (error) {
      console.error("Error on apply click.", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const categoryDoc = firestore
        .collection("orgs")
        .doc(auth.currentUser.uid)
        .collection("activityDescriptions")
        .doc(category.id);

      await categoryDoc.delete();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error on delete click.", error);
    }
  };

  return (
    <div
      key={category.id}
      className={`w-100 user-item ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditMode ? (
        <Form className="w-100">
          <Row className="align-items-center justify-content-between">
            <Col className="mr-2">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={APP_STRINGS.CAT_ENTER_NAME}
                  value={editedCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col className="justify-content-end">
              <Form.Group>
                <Button variant="link" onClick={handleApplyClick}>
                  {APP_STRINGS.CAT_APPLY}
                </Button>
                <Button variant="link" onClick={handleCancelClick}>
                {APP_STRINGS.CAT_CANCEL}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      ) : (
        <div className="user-details">{category.text}</div>
      )}
      {isHovered && !isEditMode && (
        <div className="action-buttons">
          <Button variant="link" className="mr-2" onClick={handleEditClick}>
            {APP_STRINGS.CAT_EDIT}
          </Button>
          <Button variant="link" onClick={handleDeleteClick}>
            {APP_STRINGS.CAT_DELETE}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
