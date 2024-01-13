const deleteListingButtons = document.querySelectorAll(".deleteListingConfirm");
const deleteReviewButtons = document.querySelectorAll(".deleteReviewConfirm");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
deleteListingButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const confirmation = confirm(
      "Are you sure you want to delete this Listing?"
    );
    if (confirmation) {
      btn.closest("form").submit();
    }
  });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
deleteReviewButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const confirmation = confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmation) {
      btn.closest("form").submit();
    }
  });
});
