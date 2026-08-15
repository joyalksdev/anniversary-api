// Express 4 doesn't forward rejected promises to the error handler on its
// own — wrap async controllers with this so a thrown/rejected error still
// hits the centralized error middleware instead of hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
