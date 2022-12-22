const userModel = require('./userSchema');
const { isValidString,isValidEmail,isValidMobileNo,isValidPassword,isValidpincode} = require('../utils/validtion')
const {uploadFile} = require('../utils/aws.js');
const bcrypt = require('bcrypt');

module.exports = async function (req, res) {
    try {
    let data = req.body;
    let files = req.files;
   
        let { fname,
            lname,
            email,
            phone,
            password,
            address
        } = data;

        address = JSON.parse(address);
        // address=JSON.parse(address);

        if (Object.keys(data).length == 0) return res.status(400).send({ msg: "all data is required"
        });
        if (!fname || !isValidString(fname)) return res.status(400).send({
            msg: "first name is required"
        });
        if (!lname || !isValidString(lname)) return res.status(400).send({
            msg: "last name is required"
        });

        if (!email || !isValidString(email)) return res.status.send(400).send({
            msg: "email id is required"
        });
        if (!isValidEmail(email)) return res.status.send({
            msg: "email is not valid please provide valid email"
        });
        let checkemail = await userModel.findOne({email});
        if (checkemail) return res.status(400).send({status: false,msg: " this emailId already register"});


        if (!phone) return res.status(400).send({
            status: false,
            message: "phone is required"
        })
        if (!isValidMobileNo(phone)) return res.status(400).send({
            status: false,
            message: `${phone} is not a valid phone.`
        })
        const isPhoneAlreadyUsed = await userModel.findOne({phone})
        if (isPhoneAlreadyUsed) {
            return res.status(409).send({
                status: false,
                message: `${phone} is already in use, Please try a new phone number.`})
        }


        if (files.length === 0) return res.status(400).send({
            status: false,
            message: "Profile Image is mandatory"
        })
        if (!password) return res.status(400).send({
            status: false,
            message: "password is required"
        })
        if (!isValidPassword(password)) return res.status(400).send({
            status: false,
            msg: "Please provide a valid Password with min 8 to 15 char with Capatial & special (@#$%^!)"
        })



        if (!address) return res.status(400).send({
            status: false,
            message: "address is required"
        })
        if (address.shipping) {

            if (!isValidString(address.shipping.street)) return res.status(400).send({
                status: false,
                message: "Shipping address's Street Required"
            })
            if (!isValidString(address.shipping.city)) return res.status(400).send({
                status: false,
                message: "Shipping address city Required"
            })
            if (!(address.shipping.pincode)) return res.status(400).send({
                status: false,
                message: "Shipping address's pincode Required"
            })
            if (!isValidpincode(address.shipping.pincode)) return res.status(400).send({
                status: false,
                message: "Shipping Pinecode is not valide"
            })

        } else {
            return res.status(400).send({
                status: false,
                message: "Shipping address cannot be empty."
            })
        }
        // Billing Address validation

        if (address.billing) {
            if (!isValidString(address.billing.street)) return res.status(400).send({
                status: false,
                message: "billing address's Street Required"
            })
            if (!isValidString(address.billing.city)) return res.status(400).send({
                status: false,
                message: "billing address city Required"
            })
            if (!(address.shipping.pincode)) return res.status(400).send({
                status: false,
                message: "billing address's pincode Required"
            })
            if (!isValidpincode(address.billing.pincode)) return res.status(400).send({
                status: false,
                message: "billing Pinecode is not valide"
            })

        } else
            return res.status(400).send({
                status: false,
                message: "Billing address cannot be empty."
            })
    
        let profileImage = await uploadFile(files[0]); //upload image to AWS
        const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt.

        //object destructuring for response body.
        const userData = {
            fname,
            lname,
            email,
            profileImage,
            phone,
            password: encryptedPassword,
            address
        }
        const saveUserData = await userModel.create(userData);
        return res.status(201).send({
            status: true,
            message: "user created successfully.",
            data: saveUserData
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}