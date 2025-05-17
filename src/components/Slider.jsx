import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import Spinner from "./Spinner"
import 'swiper/css/autoplay';


function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings")
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))
        const querySnap = await getDocs(q)
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }
    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }
  
  return (
    listings && (
      <div className="exploreSlider">
        <p className="exploreCategoryHeading">Recommended</p>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={50}
          autoplay={{ delay: 3000 , disableOnInteraction: false }}
          className="swiperSlide"
          slidesPerView={1}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => swiper.slideTo(0)}
        >
          {listings.map(({data, id}) => (
            <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
              <div style={{
                cursor: 'pointer',
                borderRadius: '1.5rem',
                background: `url(${data.imgUrls[0]}) center no-repeat`, 
                backgroundSize: 'cover'}} 
                className="swiperSlideDiv">
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  ${data.offer ? data.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  {data.type === 'rent' ? ' / Month' : ''}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  )
}

export default Slider
