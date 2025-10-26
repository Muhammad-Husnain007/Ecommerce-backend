import AddressModel from "../models/address.model.js";

 const addAddress = async (req, res) => {
  try {
    const { address_line, city, state, pincode, country, mobile } = req.body;
    console.log("body: ", req.user)
    if (!address_line || !city || !state || !pincode || !country || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const address = await AddressModel.create({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId: req.user._id, 
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

 const getUserAddresses = async (req, res) => {
  try {
    const addresses = await AddressModel.find({ userId: req.user._id });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully",
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

 const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await AddressModel.findById(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address retrieved successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

 const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
     {... req.body},
    { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or you are not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

 const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const deletedAddress = await AddressModel.findOneAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export{
    addAddress,
    getUserAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
}
