import { Link } from "react-router-dom"
import DeleteIcon from "../assets/svg/deleteIcon.svg"
import bedIcon from "../assets/svg/bedIcon.svg"
import bathtubIcon from "../assets/svg/bathtubIcon.svg"
import EditIcon from "../assets/svg/editIcon.svg"

function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <div className="listingItem">
      <li className="categoryListing">
        <Link to={`/category/${listing.type}/${id}`} className="categoryListingLink">
          <img src={listing.imgUrls[0]} alt={listing.name} className="categoryListingImg" />
          <div className="categoryListingDetails">
            <p className="categoryListingLocation">
              {listing.location}
            </p>
            <p className="categoryListingName">
              {listing.name}
            </p>
            <p className="categoryListingPrice">
              ${listing.offer ? listing.discountedPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
              {listing.type === "rent" && " / month"}
            </p>
            <div className="categoryListingInfoDiv">
              <img src={bedIcon} alt="bed" />
              <p className="categoryListingInfoText">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
              <img src={bathtubIcon} alt="bath" />
              <p className="categoryListingInfoText">
                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
              </p>
            </div>
          </div>
        </Link>
        {onEdit && (
          <img src={EditIcon} alt="edit" className="editIcon" onClick={() => onEdit(listing.id)} />
        )}

        {onDelete && (
          <img src={DeleteIcon} alt="delete" className="removeIcon" onClick={() => onDelete(listing.id, listing.name)} />
        )}
      </li>
    </div>
  )
}

export default ListingItem
