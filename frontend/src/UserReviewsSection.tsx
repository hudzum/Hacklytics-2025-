import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

// Review type without ID or likes.
interface Review {
  firstName: string
  lastName: string
  description: string
  moneySaved?: number
  proofs?: string[]
  postedAt: string
}

// Define your dummy review
const dummyReview: Review = {
  firstName: "John",
  lastName: "Doe",
  description: "This app is legit!!",
  moneySaved: 10000,
  proofs: [],
  postedAt: "01/01/2000"
}

export function UserReviewsSection() {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [visibleCount, setVisibleCount] = React.useState(10)

  // Temporary form state
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [moneySaved, setMoneySaved] = React.useState("")
  const [proofImages, setProofImages] = React.useState<FileList | null>(null)

  // Load reviews from JSON file on mount and prepend the dummy review
  React.useEffect(() => {
    fetch('/public/reviews.json')
      .then((response) => response.json())
      .then((data) => {
        // Prepend the dummy review so it always appears.
        setReviews([dummyReview, ...data])
      })
      .catch((error) => {
        console.error("Error loading reviews:", error)
        // If there's an error, at least display the dummy review.
        setReviews([dummyReview])
      })
  }, [])

  // Toggle the form
  const handleAddReviewClick = () => {
    setShowForm((prev) => !prev)
  }

  // Submit the form (will only update state, not the JSON file)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let proofsArray: string[] = []
    if (proofImages) {
      proofsArray = Array.from(proofImages).map((file) =>
        URL.createObjectURL(file)
      )
    }

    const newReview: Review = {
      firstName,
      lastName,
      description,
      moneySaved: moneySaved ? parseFloat(moneySaved) : undefined,
      proofs: proofsArray,
      postedAt: new Date().toLocaleString(),
    }

    // Insert the new review at the front so it's the most recent.
    setReviews((prev) => [newReview, ...prev])
    setShowForm(false)
    setFirstName("")
    setLastName("")
    setDescription("")
    setMoneySaved("")
    setProofImages(null)
  }

  // Show next 10 reviews
  const loadMoreReviews = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const visibleReviews = reviews.slice(0, visibleCount)

  return (
    <div className="py-12 px-6 w-full scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">User Reviews</h2>
        <div className="text-center mb-6">
          <Button
            variant="outline"
            onClick={handleAddReviewClick}
            style={{ transition: 'all 0.3s ease-in-out' }}
          className="border border-black text-white bg-blue-300 hover:bg-red-300 hover:text-white"
          >
            {showForm ? "Cancel" : "Add User Review"}
          </Button>
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out 
            ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <form onSubmit={handleSubmit} className="bg-white p-4 mb-8 shadow-md rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                required
                placeholder="First Name"
                className="border p-2 w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Last Name"
                className="border p-2 w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Description"
                className="border p-2 w-full"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="number"
                placeholder="Money Saved (Optional)"
                className="border p-2 w-full"
                value={moneySaved}
                onChange={(e) => setMoneySaved(e.target.value)}
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setProofImages(e.target.files)}
                className="border p-2 w-full"
              />
            </div>
            <Button
              type="submit"
              style={{ transition: 'all 0.3s ease-in-out' }}
            className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
            >
              Submit Review
            </Button>
          </form>
        </div>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet.</p>
        ) : (
          <>
            <div className="space-y-4">
              {visibleReviews.map((review, idx) => (
                <ReviewCard key={idx} review={review} />
              ))}
            </div>
            {visibleCount < reviews.length && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={loadMoreReviews}
                  className="border border-black text-black bg-transparent hover:bg-black hover:text-white transition-colors duration-500"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ReviewCard({
  review,
}: {
  review: {
    firstName: string
    lastName: string
    description: string
    moneySaved?: number
    proofs?: string[]
    postedAt: string
  }
}) {
  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-normal mb-1">
          {review.description}
        </CardTitle>
        {review.moneySaved && (
          <CardDescription className="text-2xl font-normal">
            ClaimCure helped {review.firstName} saved ${review.moneySaved.toLocaleString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {review.proofs && review.proofs.length > 0 && (
          <div className="relative group overflow-hidden max-h-0 transition-all duration-700 ease-in-out hover:max-h-[500px]">
            <div className="flex flex-wrap gap-4 pb-4">
              {review.proofs.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Proof ${idx + 1}`}
                  className="w-40 h-auto object-cover rounded-md border"
                />
              ))}
            </div>
          </div>
        )}
        <div className="text-right text-sm text-gray-500 mt-4">
          Posted by {review.firstName} {review.lastName} at {review.postedAt}
        </div>
      </CardContent>
    </Card>
  )
}
