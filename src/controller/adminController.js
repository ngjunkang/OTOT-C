const User = require("../model/userModel");
const { ROLES } = require("../config/roles");

const handleAssignRole = async (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({
      status: "error",
      message: "Missing username/role!",
    });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found!",
    });
  }
  const isRoleExisted = user.roles.some((r) => r.role === role);
  if (isRoleExisted) {
    return res.status(400).json({
      status: "error",
      message: "Role is existed!",
    });
  }
  user.roles.push({ role, code: ROLES[role] });
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Assign role successfully!",
  });
};

module.exports = { handleAssignRole };
