/*
  # Add Seller Statistics View and Function

  This migration creates a view to calculate seller statistics based on customer reviews.
  Sellers are ranked by average rating, number of reviews, and verified status.

  ## New Components

  ### Seller Stats View
  - Aggregates all reviews for each seller's products
  - Calculates average rating
  - Counts total reviews
  - Provides verified status and seller information
  - Used by the Top Sellers section
*/

CREATE OR REPLACE VIEW seller_stats AS
SELECT
  p.seller_id,
  pr.full_name,
  pr.profile_image_url,
  pr.address,
  pr.latitude,
  pr.longitude,
  pr.verified,
  pr.phone,
  COUNT(r.id) as total_reviews,
  ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
  COUNT(DISTINCT p.id) as product_count
FROM profiles pr
LEFT JOIN products p ON pr.id = p.seller_id
LEFT JOIN reviews r ON p.id = r.product_id
WHERE pr.role = 'seller'
GROUP BY
  p.seller_id,
  pr.id,
  pr.full_name,
  pr.profile_image_url,
  pr.address,
  pr.latitude,
  pr.longitude,
  pr.verified,
  pr.phone
ORDER BY
  avg_rating DESC,
  total_reviews DESC,
  pr.verified DESC;