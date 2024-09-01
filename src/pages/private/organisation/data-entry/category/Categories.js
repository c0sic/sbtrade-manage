import React, { useState, useEffect } from "react";
import CategoryItem from "./CategoryItem";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import APP_STRINGS from "../../../../../util/strings";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoriesRef = firestore
      .collection("orgs")
      .doc(auth.currentUser.uid)
      .collection("activityDescriptions");

    const unsubscribe = categoriesRef.onSnapshot((snapshot) => {
      const promises = snapshot.docs.map(async (doc) => {
        const categoryDoc = await doc.ref.get();
        return categoryDoc.data();
      });

      Promise.all(promises)
        .then((categoriesData) => {
          setCategories(categoriesData);
        })
        .catch((error) => {
          console.log("Error fetching categories: ", error);
        });
    });

    return () => unsubscribe();
  }, []);

  const updateCategoriesList = (categoryId, updatedData) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId ? { ...category, ...updatedData } : category
      )
    );
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h3>{APP_STRINGS.CAT_CATEGORIES}</h3>
        <Link to="/org/add-location">
          <Button variant="primary">{APP_STRINGS.CAT_ADD_NEW}</Button>
        </Link>
      </div>

      <ul className="mt-3">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            updateCategoriesList={updateCategoriesList}
          />
        ))}
      </ul>
    </div>
  );
};

export default Categories;
