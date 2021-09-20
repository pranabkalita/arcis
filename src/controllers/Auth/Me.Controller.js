import { SuccessResponse } from "utils/Response";
import { updateUser } from "service/User.Service";
import CatchAsyncErrors from "utils/CatchAsyncErrors";

/**
 * Returns the profile of logged in user
 */
const show = CatchAsyncErrors(async (req, res, next) => {
  return SuccessResponse(res, 200, {
    user: req.user,
  });
});

/**
 * Update the user profile
 */
const update = CatchAsyncErrors(async (req, res, next) => {
  // 1) Prepare the update data
  const { firstName, lastName } = req.body;
  let data = {
    firstName: firstName ? firstName : req.user.firstName,
    lastName: lastName ? lastName : req.user.lastName,
  };

  // 2) Prepare the avatar data
  if (req.files && req.files.avatar && req.files.avatar.length > 0) {
    const { destination, filename } = req.files.avatar[0];
    data["avatar"] = `${destination}/${filename}`;
  }

  // 3) Update the user profile
  const updatedUser = await updateUser({ email: req.user.email }, data);

  // 4) Send back the response with updated details
  return SuccessResponse(res, 200, {
    user: updatedUser,
  });
});

export default {
  show,
  update,
};
