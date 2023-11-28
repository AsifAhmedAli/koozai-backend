const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../DB/db.js"); // Database connection
const crypto = require("crypto");
const requestIp = require('request-ip');
const moment = require('moment');
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const cron = require("node-cron");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ######## User's SIGN_UP API code ######### //

// const user_signup = async (req, res) => {
//   const generateReferralCode = () => {
//     const codeLength = 6;
//     const randomBytes = crypto.randomBytes(codeLength);
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let code = "";

//     for (let i = 0; i < codeLength; i++) {
//       const randomIndex = randomBytes[i] % characters.length;
//       code += characters.charAt(randomIndex);
//     }

//     return code;
//   };

//   try {
//     const {
//       username,
//       phone,
//       password,
//       withdraw_password,
//       gender,
//       invitation_code,
//       agreedToTerms,
//     } = req.body;

//     // Check if the user agreed to terms and conditions
//     if (!agreedToTerms) {
//       return res
//         .status(400)
//         .json({ error: "You must agree to the terms and conditions" });
//     }

//     const saltRounds = 10;
//     const hashedLoginPassword = await bcrypt.hash(password, saltRounds);
//     const hashedWithdrawPassword = await bcrypt.hash(
//       withdraw_password,
//       saltRounds
//     );
//     const referralCode = generateReferralCode();

//     // Check if the phone number already exists
//     const sqlCheckPhone = `
//       SELECT id FROM users WHERE phone = ?
//     `;

//     db.query(
//       sqlCheckPhone,
//       [phone],
//       async (checkPhoneError, checkPhoneResult) => {
//         if (checkPhoneError) {
//           console.error(checkPhoneError);
//           return res.status(500).json({ error: "Signup failed" });
//         }

//         if (checkPhoneResult.length > 0) {
//           return res.status(400).json({ error: "Phone number already exists" });
//         }

//         // Continue with the rest of the code if phone number is unique
//         const sqlCheckUsername = `
//           SELECT id FROM users WHERE username = ?
//         `;

//         db.query(
//           sqlCheckUsername,
//           [username],
//           async (checkUsernameError, checkUsernameResult) => {
//             if (checkUsernameError) {
//               console.error(checkUsernameError);
//               return res.status(500).json({ error: "Signup failed" });
//             }

//             if (checkUsernameResult.length > 0) {
//               return res.status(400).json({ error: "Username already exists" });
//             }

//             // Validate and retrieve the user_id associated with the referral code
//             const sqlValidateInvitationCode = `
//               SELECT user_id FROM referral_codes WHERE code = ?
//             `;

//             db.query(
//               sqlValidateInvitationCode,
//               [invitation_code],
//               async (validateCodeError, validateCodeResult) => {
//                 if (validateCodeError) {
//                   console.error(validateCodeError);
//                   return res.status(500).json({ error: "Signup failed" });
//                 }

//                 if (validateCodeResult.length === 0) {
//                   return res.status(400).json({ error: "Invalid invitation code" });
//                 }

//                 const userId = validateCodeResult[0].user_id;

//                 // Insert the new user if username is unique
//                 const sqlInsertUser = `
//                   INSERT INTO users (username, phone, login_password, withdraw_password, gender, balance, terms_accepted)
//                   VALUES (?, ?, ?, ?, ?, ?, ?)
//                 `;

//                 db.query(
//                   sqlInsertUser,
//                   [
//                     username,
//                     phone,
//                     hashedLoginPassword,
//                     hashedWithdrawPassword,
//                     gender,
//                     15.0,
//                     agreedToTerms,
//                   ],
//                   async (userInsertError, userInsertResult) => {
//                     if (userInsertError) {
//                       console.error(userInsertError);
//                       return res.status(500).json({ error: "Signup failed" });
//                     }

//                     const userInsertId = userInsertResult.insertId;

//                     // Set the user's level as 'bronze'
//                     const sqlInsertLevel = `
//                       INSERT INTO levels (level_name, user_id)
//                       VALUES (?, ?)
//                     `;

//                     db.query(
//                       sqlInsertLevel,
//                       ["bronze", userInsertId],
//                       (levelInsertError) => {
//                         if (levelInsertError) {
//                           console.error(levelInsertError);
//                           return res.status(500).json({ error: "Signup failed" });
//                         }

//                         // Insert the referral code for the new user
//                         const sqlInsertReferralCode = `
//                           INSERT INTO referral_codes (code, user_id, referred_by)
//                           VALUES (?, ?, ?)
//                         `;

//                         db.query(
//                           sqlInsertReferralCode,
//                           [referralCode, userInsertId, invitation_code],
//                           (referralInsertError) => {
//                             if (referralInsertError) {
//                               console.error(referralInsertError);
//                               return res
//                                 .status(500)
//                                 .json({ error: "Signup failed" });
//                             }

//                             // Create a notification for the new user
//                             const welcomeMessage =
//                               "Welcome to koozai, you have successfully registered as our user and received a newcomer registration bonus of 15.00 USDT!";

//                             const sqlInsertNotification = `
//                               INSERT INTO notifications (user_id, message)
//                               VALUES (?, ?)
//                             `;

//                             db.query(
//                               sqlInsertNotification,
//                               [userInsertId, welcomeMessage],
//                               (notificationInsertError) => {
//                                 if (notificationInsertError) {
//                                   console.error(notificationInsertError);
//                                   return res
//                                     .status(500)
//                                     .json({
//                                       error:
//                                         "Signup and notification creation failed",
//                                     });
//                                 }

//                                 res.status(201).json({
//                                   message: "Signup successful",
//                                   referral_code: referralCode,
//                                 });
//                               }
//                             );
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Signup failed" });
//   }
// };

// const user_signup = async (req, res) => {
//   const generateReferralCode = () => {
//     const codeLength = 6;
//     const randomBytes = crypto.randomBytes(codeLength);
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let code = "";

//     for (let i = 0; i < codeLength; i++) {
//       const randomIndex = randomBytes[i] % characters.length;
//       code += characters.charAt(randomIndex);
//     }

//     return code;
//   };

//   try {
//     const {
//       username,
//       phone,
//       password,
//       withdraw_password,
//       gender,
//       invitation_code,
//       agreedToTerms,
//     } = req.body;

//     // Check if the user agreed to terms and conditions
//     if (!agreedToTerms) {
//       return res
//         .status(400)
//         .json({ error: "You must agree to the terms and conditions" });
//     }

//     const saltRounds = 10;
//     const hashedLoginPassword = await bcrypt.hash(password, saltRounds);
//     const hashedWithdrawPassword = await bcrypt.hash(
//       withdraw_password,
//       saltRounds
//     );
//     const referralCode = generateReferralCode();

//     // Check if the phone number already exists
//     const sqlCheckPhone = `
//       SELECT id FROM users WHERE phone = ?
//     `;

//     db.query(
//       sqlCheckPhone,
//       [phone],
//       async (checkPhoneError, checkPhoneResult) => {
//         if (checkPhoneError) {
//           console.error(checkPhoneError);
//           return res.status(500).json({ error: "Signup failed" });
//         }

//         if (checkPhoneResult.length > 0) {
//           return res.status(400).json({ error: "Phone number already exists" });
//         }

//         // Continue with the rest of the code if phone number is unique
//         const sqlCheckUsername = `
//           SELECT id FROM users WHERE username = ?
//         `;

//         db.query(
//           sqlCheckUsername,
//           [username],
//           async (checkUsernameError, checkUsernameResult) => {
//             if (checkUsernameError) {
//               console.error(checkUsernameError);
//               return res.status(500).json({ error: "Signup failed" });
//             }

//             if (checkUsernameResult.length > 0) {
//               return res.status(400).json({ error: "Username already exists" });
//             }

//             // Validate and retrieve the user_id associated with the referral code
//             const sqlValidateInvitationCode = `
//               SELECT user_id FROM referral_codes WHERE code = ?
//             `;

//             db.query(
//               sqlValidateInvitationCode,
//               [invitation_code],
//               async (validateCodeError, validateCodeResult) => {
//                 if (validateCodeError) {
//                   console.error(validateCodeError);
//                   return res.status(500).json({ error: "Signup failed" });
//                 }

//                 if (validateCodeResult.length === 0) {
//                   return res.status(400).json({ error: "Invalid invitation code" });
//                 }

//                 const userId = validateCodeResult[0].user_id;

//                 // Insert the new user if username is unique
//                 const sqlInsertUser = `
//                   INSERT INTO users (username, phone, login_password, withdraw_password, gender, balance, terms_accepted)
//                   VALUES (?, ?, ?, ?, ?, ?, ?)
//                 `;

//                 db.query(
//                   sqlInsertUser,
//                   [
//                     username,
//                     phone,
//                     hashedLoginPassword,
//                     hashedWithdrawPassword,
//                     gender,
//                     15.0,
//                     agreedToTerms,
//                   ],
//                   async (userInsertError, userInsertResult) => {
//                     if (userInsertError) {
//                       console.error(userInsertError);
//                       return res.status(500).json({ error: "Signup failed" });
//                     }

//                     const userInsertId = userInsertResult.insertId;

//                     // Set the user's level as 'bronze'
//                     const sqlInsertLevel = `
//                       INSERT INTO levels (level_name, commission_per_data, merge_commission, max_data_limit, max_sets_per_day, withdrawal_limit, max_withdrawals_per_day, handling_fee)
//                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//                     `;

//                     db.query(
//                       sqlInsertLevel,
//                       ["bronze", 0.5, 1.5, 40, 2, 0.0, 3, 0.0],
//                       (levelInsertError, levelInsertResult) => {
//                         if (levelInsertError) {
//                           console.error(levelInsertError);
//                           return res.status(500).json({ error: "Signup failed" });
//                         }

//                         const levelId = levelInsertResult.insertId;

//                         // Update the user's level_id in the users table
//                         const sqlUpdateUserLevel = `
//                           UPDATE users SET level_id = ? WHERE id = ?
//                         `;

//                         db.query(
//                           sqlUpdateUserLevel,
//                           [levelId, userInsertId],
//                           (updateUserLevelError) => {
//                             if (updateUserLevelError) {
//                               console.error(updateUserLevelError);
//                               return res.status(500).json({ error: "Signup failed" });
//                             }

//                         // Insert the referral code for the new user
//                         const sqlInsertReferralCode = `
//                           INSERT INTO referral_codes (code, user_id, referred_by)
//                           VALUES (?, ?, ?)
//                         `;

//                         db.query(
//                           sqlInsertReferralCode,
//                           [referralCode, userInsertId, invitation_code],
//                           (referralInsertError) => {
//                             if (referralInsertError) {
//                               console.error(referralInsertError);
//                               return res
//                                 .status(500)
//                                 .json({ error: "Signup failed" });
//                             }

//                             // Create a notification for the new user
//                             const welcomeMessage =
//                               "Welcome to koozai, you have successfully registered as our user and received a newcomer registration bonus of 15.00 USDT!";

//                             const sqlInsertNotification = `
//                               INSERT INTO notifications (user_id, message)
//                               VALUES (?, ?)
//                             `;

//                             db.query(
//                               sqlInsertNotification,
//                               [userInsertId, welcomeMessage],
//                               (notificationInsertError) => {
//                                 if (notificationInsertError) {
//                                   console.error(notificationInsertError);
//                                   return res
//                                     .status(500)
//                                     .json({
//                                       error:
//                                         "Signup and notification creation failed",
//                                     });
//                                 }

//                                 res.status(201).json({
//                                   message: "Signup successful",
//                                   referral_code: referralCode,
//                                 });
//                               }
//                             );
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         );
//       }
//     );
//   }
//      )} catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Signup failed" });
//   }
// };

// const user_signup = async (req, res) => {
//   const generateReferralCode = () => {
//     const codeLength = 6;
//     const randomBytes = crypto.randomBytes(codeLength);
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let code = "";

//     for (let i = 0; i < codeLength; i++) {
//       const randomIndex = randomBytes[i] % characters.length;
//       code += characters.charAt(randomIndex);
//     }

//     return code;
//   };

//   try {
//     const {
//       username,
//       phone,
//       password,
//       withdraw_password,
//       gender,
//       invitation_code,
//       agreedToTerms,
//     } = req.body;

//     // Check if the user agreed to terms and conditions
//     if (!agreedToTerms) {
//       return res
//         .status(400)
//         .json({ error: "You must agree to the terms and conditions" });
//     }

//     const saltRounds = 10;
//     const hashedLoginPassword = await bcrypt.hash(password, saltRounds);
//     const hashedWithdrawPassword = await bcrypt.hash(
//       withdraw_password,
//       saltRounds
//     );
//     const referralCode = generateReferralCode();

//     // Validate and retrieve the user_id associated with the referral code
//     const sqlValidateInvitationCode = `
//       SELECT user_id FROM referral_codes WHERE code = ?
//     `;

//     db.query(
//       sqlValidateInvitationCode,
//       [invitation_code],
//       async (validateCodeError, validateCodeResult) => {
//         if (validateCodeError) {
//           console.error(validateCodeError);
//           return res.status(500).json({ error: "Signup failed" });
//         }

//         if (validateCodeResult.length === 0) {
//           return res.status(400).json({ error: "Invalid invitation code" });
//         }

//         const userId = validateCodeResult[0].user_id;

//         // Get the level_id for "bronze" membership level
//         const sqlGetBronzeLevelId = `
//           SELECT level_id FROM levels WHERE level_name = 'bronze'
//         `;

//         db.query(sqlGetBronzeLevelId, (levelError, levelResult) => {
//           if (levelError) {
//             console.error(levelError);
//             return res.status(500).json({ error: "Signup failed" });
//           }

//           if (levelResult.length === 0) {
//             return res.status(404).json({ error: "Bronze level not found" });
//           }

//           const bronzeLevelId = levelResult[0].level_id;

//           // Insert the new user with the assigned membership level
//           const sqlInsertUser = `
//             INSERT INTO users (username, phone, login_password, withdraw_password, gender, balance, terms_accepted, level_id)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//           `;

//           db.query(
//             sqlInsertUser,
//             [
//               username,
//               phone,
//               hashedLoginPassword,
//               hashedWithdrawPassword,
//               gender,
//               15.0,
//               agreedToTerms,
//               bronzeLevelId,
//             ],
//             async (userInsertError, userInsertResult) => {
//               if (userInsertError) {
//                 console.error(userInsertError);
//                 return res.status(500).json({ error: "Signup failed" });
//               }

//               const userInsertId = userInsertResult.insertId;

//               // Insert the referral code for the new user
//               const sqlInsertReferralCode = `
//                 INSERT INTO referral_codes (code, user_id, referred_by)
//                 VALUES (?, ?, ?)
//               `;

//               db.query(
//                 sqlInsertReferralCode,
//                 [referralCode, userInsertId, invitation_code],
//                 (referralInsertError) => {
//                   if (referralInsertError) {
//                     console.error(referralInsertError);
//                     return res.status(500).json({ error: "Signup failed" });
//                   }

//                   // Create a notification for the new user
//                   const welcomeMessage =
//                     "Welcome to koozai, you have successfully registered as our user and received a newcomer registration bonus of 15.00 USDT!";

//                   const sqlInsertNotification = `
//                     INSERT INTO notifications (user_id, message)
//                     VALUES (?, ?)
//                   `;

//                   db.query(
//                     sqlInsertNotification,
//                     [userInsertId, welcomeMessage],
//                     (notificationInsertError) => {
//                       if (notificationInsertError) {
//                         console.error(notificationInsertError);
//                         return res
//                           .status(500)
//                           .json({
//                             error:
//                               "Signup and notification creation failed",
//                           });
//                       }

//                       res.status(201).json({
//                         message: "Signup successful",
//                         referral_code: referralCode,
//                       });
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         });
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Signup failed" });
//   }
// };

  const user_signup = async (req, res) => {
    const generateReferralCode = () => {
      const codeLength = 6;
      const randomBytes = crypto.randomBytes(codeLength);
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";

      for (let i = 0; i < codeLength; i++) {
        const randomIndex = randomBytes[i] % characters.length;
        code += characters.charAt(randomIndex);
      }

      return code;
    };

    try {
      const {
        username,
        phone,
        password,
        withdraw_password,
        gender,
        invitation_code,
        agreedToTerms,
      } = req.body;

      const clientIp = req.clientIp; 
      
      // Check if the user agreed to terms and conditions
      if (!agreedToTerms) {
        return res
          .status(400)
          .json({ error: "You must agree to the terms and conditions" });
      }

      const saltRounds = 10;
      const hashedLoginPassword = await bcrypt.hash(password, saltRounds);
      const hashedWithdrawPassword = await bcrypt.hash(
        withdraw_password,
        saltRounds
      );
      const referralCode = generateReferralCode();

      // Check if the phone number already exists
      const sqlCheckPhone = `
          SELECT id FROM users WHERE phone = ?
        `;

      db.query(
        sqlCheckPhone,
        [phone],
        async (checkPhoneError, checkPhoneResult) => {
          if (checkPhoneError) {
            console.error(checkPhoneError);
            return res.status(500).json({ error: "Signup failed" });
          }

          if (checkPhoneResult.length > 0) {
            return res.status(400).json({ error: "Phone number already exists" });
          }

          // Continue with the rest of the code if phone number is unique

          // Check if the username already exists
          const sqlCheckUsername = `
            SELECT id FROM users WHERE username = ?
          `;

          db.query(
            sqlCheckUsername,
            [username],
            async (checkUsernameError, checkUsernameResult) => {
              if (checkUsernameError) {
                console.error(checkUsernameError);
                return res.status(500).json({ error: "Signup failed" });
              }

              if (checkUsernameResult.length > 0) {
                return res.status(400).json({ error: "Username already exists" });
              }

              // Validate and retrieve the user_id associated with the referral code
              // const sqlValidateInvitationCode = `
              //   SELECT user_id FROM referral_codes WHERE code = ?
              // `;

              const sqlValidateInvitationCode = `
              SELECT
                u.username AS new_user_username,
                r.user_id,
                ru.username AS referring_user_username
              FROM referral_codes r
              JOIN users u ON r.user_id = u.id
              LEFT JOIN users ru ON r.user_id = ru.id
              WHERE r.code = ?;
            `;

              db.query(
                sqlValidateInvitationCode,
                [invitation_code],
                async (validateCodeError, validateCodeResult) => {
                  if (validateCodeError) {
                    console.error(validateCodeError);
                    return res.status(500).json({ error: "Signup failed" });
                  }

                  if (validateCodeResult.length === 0) {
                    return res
                      .status(400)
                      .json({ error: "Invalid invitation code" });
                  }

                  // const userId = validateCodeResult[0].user_id;
                  const { new_user_username, user_id, referring_user_id, referring_user_username } = validateCodeResult[0];

                  // console.log(new_user_username)
                  

                  // Get the level_id for "bronze" membership level
                  const sqlGetBronzeLevelId = `
                    SELECT level_id FROM levels WHERE level_name = 'bronze'
                  `;

                  db.query(sqlGetBronzeLevelId, (levelError, levelResult) => {
                    if (levelError) {
                      console.error(levelError);
                      return res.status(500).json({ error: "Signup failed" });
                    }

                    if (levelResult.length === 0) {
                      return res
                        .status(404)
                        .json({ error: "Bronze level not found" });
                    }

                    const bronzeLevelId = levelResult[0].level_id;

                    // Insert the new user with the assigned membership level
                    const sqlInsertUser = `
                      INSERT INTO users (user_ip,username, phone, login_password, withdraw_password, gender, balance, terms_accepted, level_id)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    db.query(
                      sqlInsertUser,
                      [
                        clientIp,
                        username,
                        phone,
                        hashedLoginPassword,
                        hashedWithdrawPassword,
                        gender,
                        15.0,
                        agreedToTerms,
                        bronzeLevelId,
                      ],
                      async (userInsertError, userInsertResult) => {
                        if (userInsertError) {
                          console.error(userInsertError);
                          return res.status(500).json({ error: "Signup failed" });
                        }

                        const userInsertId = userInsertResult.insertId;

                        // Insert the referral code for the new user
                        // const sqlInsertReferralCode = `
                        //   INSERT INTO referral_codes (code, user_id, referred_by)
                        //   VALUES (?, ?, ?)
                        // `;

                        const sqlInsertReferralCode = `
                        INSERT INTO referral_codes (code, user_id, referred_by, referring_user_name)
                        VALUES (?, ?, ?, ?)
                      `;

                        db.query(
                          sqlInsertReferralCode,
                          [referralCode, userInsertId, invitation_code,new_user_username],
                          (referralInsertError) => {
                            if (referralInsertError) {
                              console.error(referralInsertError);
                              return res
                                .status(500)
                                .json({ error: "Signup failed" });
                            }

                            // Create a notification for the new user
                            const welcomeMessage =
                              "Welcome to koozai, you have successfully registered as our user and received a newcomer registration bonus of 15.00 USDT!";

                            const sqlInsertNotification = `
                              INSERT INTO notifications (user_id, message)
                              VALUES (?, ?)
                            `;

                            db.query(
                              sqlInsertNotification,
                              [userInsertId, welcomeMessage],
                              (notificationInsertError) => {
                                if (notificationInsertError) {
                                  console.error(notificationInsertError);
                                  return res.status(500).json({
                                    error:
                                      "Signup and notification creation failed",
                                  });
                                }

                                res.status(201).json({
                                  message: "Signup successful",
                                  referral_code: referralCode,
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  });
                }
              );
            }
          );
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Signup failed" });
    }
  };

// ######## User's LOGIN API code ######### //
// const user_login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if the user exists
//     const sqlCheckUser = `
//       SELECT * FROM users WHERE username = ?
//     `;

//     db.query(
//       sqlCheckUser,
//       [username],
//       async (checkUserError, checkUserResult) => {
//         if (checkUserError) {
//           console.error(checkUserError);
//           return res.status(500).json({ error: "Login failed" });
//         }

//         if (checkUserResult.length === 0) {
//           return res
//             .status(400)
//             .json({ error: "Username or password is incorrect" });
//         }

//         const user = checkUserResult[0];

//         if (user.is_active === 0) {
//           return res
//             .status(403)
//             .json({
//               error:
//                 "Your account is blocked by admin, please contact with customer support",
//             });
//         }

//         // Verify the password
//         const isPasswordValid = await bcrypt.compare(
//           password,
//           user.login_password
//         );

//         if (!isPasswordValid) {
//           return res
//             .status(400)
//             .json({ error: "Username or password is incorrect" });
//         }

//         // Create and sign a JWT token
//         const token = jwt.sign(
//           { userId: user.id, username: user.username, userrole: user.role },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: "2d",
//           }
//         );

//         // Set the JWT token as a cookie
//         res.cookie("user_token", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }); // 2 days in milliseconds

//         // Removing sensitive data
//         delete user.login_password;
//         delete user.withdraw_password;

//         res.status(200).json({ message: "Login successful", user, token });
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Login failed" });
//   }
// };

const user_login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if the user exists using username or phone number
    const sqlCheckUser = `
      SELECT * FROM users WHERE username = ? OR phone = ?
    `;

    db.query(
      sqlCheckUser,
      [identifier, identifier],
      async (checkUserError, checkUserResult) => {
        if (checkUserError) {
          console.error(checkUserError);
          return res.status(500).json({ error: "Login failed" });
        }

        if (checkUserResult.length === 0) {
          return res
            .status(400)
            .json({ error: "Username or password is incorrect" });
        }

        const user = checkUserResult[0];

        if (user.is_active === 0) {
          return res.status(403).json({
            error:
              "Your account is blocked by admin, please contact customer support",
          });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(
          password,
          user.login_password
        );

        if (!isPasswordValid) {
          return res
            .status(400)
            .json({ error: "Username or password is incorrect" });
        }

        // Create and sign a JWT token
        const token = jwt.sign(
          { userId: user.id, username: user.username, userrole: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "2d",
          }
        );

        // Set the JWT token as a cookie
        res.cookie("user_token", token, {
          maxAge: 2 * 24 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
        }); // 2 days in milliseconds

        // Removing sensitive data
        delete user.login_password;
        delete user.withdraw_password;

        res.status(200).json({ message: "Login successful", user, token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

const user_logout = (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("user_token");

    // You can also send a response indicating successful logout if needed
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Logout failed" });
  }
};

// ######## get User's PROFILE API code ######### //

// const get_user_profile = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const logged_in_user_id = req.user.userId;

//     if (userId != logged_in_user_id) {
//       return res
//         .status(401)
//         .json({ error: "You can not view the profile of this user!" });
//     }

//     // Fetch user profile from the database
//     const sqlGetUserProfile = `
//       SELECT u.*, l.level_name, r.code AS referral_code, r.referred_by
//       FROM users u
//       LEFT JOIN levels l ON u.id = l.user_id
//       LEFT JOIN referral_codes r ON u.id = r.user_id
//       WHERE u.id = ?
//     `;
//     db.query(sqlGetUserProfile, [userId], (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Failed to fetch user profile" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const userProfile = results[0];

//       // Removing sensitive data
//       delete userProfile.login_password;
//       delete userProfile.withdraw_password;

//       res.status(200).json(userProfile);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

const get_user_profile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You can not view the profile of this user!" });
    }

    // Fetch user profile from the database
    const sqlGetUserProfile = `
    SELECT u.*, l.*, r.code AS referral_code, r.referred_by
    FROM users u
    LEFT JOIN levels l ON u.level_id = l.level_id
    LEFT JOIN referral_codes r ON u.id = r.user_id
    WHERE u.id = ?
  `;
    db.query(sqlGetUserProfile, [userId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch user profile" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const userProfile = results[0];

      // Removing sensitive data
      delete userProfile.login_password;
      delete userProfile.withdraw_password;

      res.status(200).json(userProfile);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// ######## EDIT User's PROFILE API code ######### //

const edit_user_profile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You can only edit your own profile!" });
    }

    const { gender } = req.body;

    let profilePicUrl = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "koozai_profile_pics",
        use_filename: true,
      });
      profilePicUrl = uploadResult.secure_url;
    }

    const sqlSelectProfilePic = "SELECT profile_pic FROM users WHERE id = ?";
    db.query(sqlSelectProfilePic, [userId], async (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Failed to fetch profile picture URL" });
      }

      const oldProfilePicUrl = results[0].profile_pic;

      if (profilePicUrl && oldProfilePicUrl) {
        const publicId = oldProfilePicUrl.split("/").slice(-1)[0].split(".")[0];

        try {
          await cloudinary.uploader.destroy(`koozai_profile_pics/${publicId}`);
        } catch (deleteError) {
          // console.error(deleteError);
          // Handle the error gracefully
          return res.status(500).json({
            error: "Failed to delete old profile picture from Cloudinary",
          });
        }
      }

      // Only update the profile_pic field if a new image was uploaded
      const sqlUpdateProfile = `
          UPDATE users
          SET ${profilePicUrl ? "profile_pic = ?," : ""} gender = ?
          WHERE id = ?
        `;

      const queryParams = profilePicUrl
        ? [profilePicUrl, gender, userId]
        : [gender, userId];

      db.query(sqlUpdateProfile, queryParams, (error, results) => {
        if (error) {
          // console.error(error);
          return res
            .status(500)
            .json({ error: "Failed to update user profile" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
      });
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// ######## Change LOGIN Password API code ######### //

const change_login_password = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = req.body.userId;
    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You can only edit your own profile!" });
    }

    const { old_password, new_password, confirm_new_password } = req.body;

    if (new_password !== confirm_new_password) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    // Fetch the user's login password hash from the database
    const sqlSelectPassword = "SELECT login_password FROM users WHERE id = ?";
    db.query(sqlSelectPassword, [userId], async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch password hash" });
      }

      const storedHash = results[0].login_password;

      // Verify the old password
      const passwordMatches = await bcrypt.compare(old_password, storedHash);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Incorrect old password" });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // Update the password in the database
      const sqlUpdatePassword =
        "UPDATE users SET login_password = ? WHERE id = ?";
      db.query(
        sqlUpdatePassword,
        [hashedNewPassword, userId],
        (error, results) => {
          if (error) {
            console.error(error);
            return res
              .status(500)
              .json({ error: "Failed to update Login password" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
          }

          res
            .status(200)
            .json({ message: "Login Password updated successfully" });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// ######## Change LOGIN Password API code ######### //

const change_withdraw_password = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = req.body.userId;
    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You can only edit your own profile!" });
    }

    const { old_password, new_password, confirm_new_password } = req.body;

    if (new_password !== confirm_new_password) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    // Fetch the user's login password hash from the database
    const sqlSelectPassword =
      "SELECT withdraw_password FROM users WHERE id = ?";
    db.query(sqlSelectPassword, [userId], async (error, results) => {
      if (error) {
        // console.error(error);
        return res.status(500).json({ error: "Failed to fetch password hash" });
      }

      const storedHash = results[0].withdraw_password;

      // Verify the old password
      const passwordMatches = await bcrypt.compare(old_password, storedHash);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Incorrect old password" });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // Update the password in the database
      const sqlUpdatePassword =
        "UPDATE users SET withdraw_password = ? WHERE id = ?";
      db.query(
        sqlUpdatePassword,
        [hashedNewPassword, userId],
        (error, results) => {
          if (error) {
            // console.error(error);
            return res
              .status(500)
              .json({ error: "Failed to update withdraw password" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
          }

          res
            .status(200)
            .json({ message: "Withdraw Password updated successfully" });
        }
      );
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// ######## Deposit amount API code ######### //

// const deposit_amount_request = (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const amount = req.body.amount || 0;

//     const logged_in_user_id = req.user.userId;

//     if (userId != logged_in_user_id) {
//       return res
//         .status(401)
//         .json({ error: "You are not authorised!" });
//     }

//     // Predefined message indicating the intent to deposit
//     // const depositMessage = `Hello Support team! User ${userId} has requested to deposit ${amount} USDT.`;
//     const depositMessage = `Hi Support team! My user ID is ${userId}.\nI would like to deposit ${amount} USDT.`;

//     // URL encode the message
//     const encodedMessage = encodeURIComponent(depositMessage);

//     // Generate a WhatsApp chat link with the predefined message
//     const SupportWhatsappLink1 = `https://api.whatsapp.com/send/?phone=923117902122&text=${encodedMessage}&type=phone_number&app_absent=0`;

//     // Insert the deposit request into the deposit_requests table
//     const depositRequest = {
//       user_id: userId,
//       amount: amount,
//       status: 'pending', // Initial status of the request
//       timestamp: new Date() // You might want to adjust this based on your database setup
//     };

//     const insertQuery = 'INSERT INTO deposit_requests SET ?';
//     db.query(insertQuery, depositRequest, (error, result) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while submitting the deposit request.' });
//       } else {
//         res.status(200).json({
//           message: 'Deposit request submitted for approval.please contact with contact support and submit payment',
//           SupportWhatsappLink1: SupportWhatsappLink1
//         });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// };

// const deposit_amount_request = (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const amount = req.body.amount || 0;

//     const logged_in_user_id = req.user.userId;

//     if (userId != logged_in_user_id) {
//       return res.status(401).json({ error: "You are not authorised!" });
//     }

//     const depositMessage = `Hi Support team! My user ID is ${userId}.\nI would like to deposit ${amount} USDT.`;

//     // Fetch WhatsApp numbers from the customer_support table and generate chat links
//     const dbQuery = 'SELECT whatsapp_number FROM customer_support';
//     db.query(dbQuery, (error, result) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while fetching WhatsApp numbers.' });
//       } else {
//         const supportWhatsAppLinks = result.map(row => {
//           const whatsappNumber = row.whatsapp_number;
//           const encodedMessage = encodeURIComponent(depositMessage);
//           return `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
//         });

//         // Insert the deposit request into the deposit_requests table
//         const depositRequest = {
//           user_id: userId,
//           amount: amount,
//           status: 'pending', // Initial status of the request
//           timestamp: new Date() // You might want to adjust this based on your database setup
//         };

//         const insertQuery = 'INSERT INTO deposit_requests SET ?';
//         db.query(insertQuery, depositRequest, (error, result) => {
//           if (error) {
//             console.error(error);
//             res.status(500).json({ error: 'An error occurred while submitting the deposit request.' });
//           } else {
//             res.status(200).json({
//               message: 'Deposit request submitted for approval. Please contact support and submit payment.',
//               supportWhatsAppLinks: supportWhatsAppLinks
//             });
//           }
//         });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// };

const deposit_amount_request = (req, res) => {
  try {
    const userId = req.body.userId;
    const amount = req.body.amount || 0;

    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res.status(401).json({ error: "You are not authorised!" });
    }

    const depositMessage = `Hi Support team! My user ID is ${userId}.\nI would like to deposit ${amount} USDT.`;

    // Fetch WhatsApp numbers and names from the customer_support table
    const dbQuery = "SELECT * FROM customer_support";
    db.query(dbQuery, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while fetching WhatsApp numbers.",
        });
      } else {
        const supportWhatsAppData = result.map((row) => {
          return {
            name: row.name,
            status: row.status,
            whatsappLink: `https://api.whatsapp.com/send/?phone=${
              row.whatsapp_number
            }&text=${encodeURIComponent(
              depositMessage
            )}&type=phone_number&app_absent=0`,
          };
        });

        // Insert the deposit request into the deposit_requests table
        const depositRequest = {
          user_id: userId,
          amount: amount,
          status: "pending",
          timestamp: new Date(),
        };

        const insertQuery = "INSERT INTO deposit_requests SET ?";
        db.query(insertQuery, depositRequest, (error, result) => {
          if (error) {
            console.error(error);
            res.status(500).json({
              error: "An error occurred while submitting the deposit request.",
            });
          } else {
            res.status(200).json({
              message:
                "Deposit request submitted for approval. Please contact support and submit payment.",
              supportWhatsAppData: supportWhatsAppData,
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// ######## FETCH DEPOSIT HISTORY BY USER ######### //
const fetch_deposit_history_by_user = (req, res) => {
  try {
    const userId = req.params.userId;

    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You can only view your own Transactions" });
    }

    // Query the database to retrieve deposit history for the user
    const query =
      "SELECT * FROM deposit_history WHERE user_id = ? ORDER BY timestamp DESC";
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      } else {
        const total_transactions = results.length;
        res.status(200).json({ total_transactions, depositHistory: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// POST endpoint to submit a withdrawal request

// const withdraw_amount_request = (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const amount = req.body.amount || 0;
//     const withdrawPassword = req.body.withdrawPassword; // Withdraw password provided by user

//     // Fetch the stored hashed password, user level, and withdrawal information
//     const getUserQuery = 'SELECT u.withdraw_password, u.data_completed, u.level_id, l.level_name, l.max_data_limit, l.withdrawal_limit, l.max_withdrawals_per_day FROM users u JOIN levels l ON u.level_id = l.level_id WHERE u.id = ?';
//     db.query(getUserQuery, [userId], (passwordError, userResult) => {
//       if (passwordError) {
//         console.error(passwordError);
//         res.status(500).json({ error: 'An error occurred while fetching user information.' });
//       } else if (userResult.length === 0) {
//         res.status(401).json({ error: 'User not found.' });
//       } else {
//         const user = userResult[0];
//         const hashedPassword = user.withdraw_password;
//         const dataCompleted = user.data_completed;
//         const levelId = user.level_id;
//         const levelName = user.level_name;
//         const maxDataLimit = user.max_data_limit;
//         const withdrawalLimit = user.withdrawal_limit;
//         const maxWithdrawalsPerDay = user.max_withdrawals_per_day;

//         // Compare the provided withdrawPassword with the hashedPassword
//         bcrypt.compare(withdrawPassword, hashedPassword, (compareError, passwordMatch) => {
//           if (compareError) {
//             console.error(compareError);
//             res.status(500).json({ error: 'An error occurred while comparing passwords.' });
//           } else if (!passwordMatch) {
//             res.status(401).json({ error: 'Invalid withdraw password.' });
//           } else if (dataCompleted < maxDataLimit) {
//             res.status(403).json({ error: `The amount in your account can only be withdrawn after ${maxDataLimit} data of the current level (${levelName}) are completed.` });
//           } else {
//             // Implement logic for withdrawal limit and maximum withdrawals per day based on user's level
//             // Check if the withdrawal amount exceeds the user's withdrawal limit (0 indicates no limit)
//             if (withdrawalLimit !== 0 && amount > withdrawalLimit) {
//               res.status(403).json({ error: `Withdrawal amount exceeds your limit of ${withdrawalLimit} USDT.` });
//             } else {
//               // Check if the user has reached the maximum number of daily withdrawals
//               const today = new Date().toISOString().split('T')[0]; // Get the current date in ISO format
//               const getUserWithdrawalsQuery = 'SELECT COUNT(*) AS dailyWithdrawalCount FROM withdraw_history WHERE user_id = ? AND date = ?';
//               db.query(getUserWithdrawalsQuery, [userId, today], (withdrawalError, withdrawalResult) => {
//                 if (withdrawalError) {
//                   console.error(withdrawalError);
//                   res.status(500).json({ error: 'An error occurred while fetching withdrawal history.' });
//                 } else {
//                   const dailyWithdrawalCount = withdrawalResult[0].dailyWithdrawalCount || 0;

//                   // Check if the user has exceeded the maximum number of daily withdrawals
//                   if (dailyWithdrawalCount >= maxWithdrawalsPerDay) {
//                     res.status(403).json({ error: `You have reached the maximum daily withdrawal limit of ${maxWithdrawalsPerDay} transactions.` });
//                   } else {
//                     // Proceed with the withdrawal process
//                     // Fetch WhatsApp numbers and names from the customer_support table
//                     const dbQuery = 'SELECT * FROM customer_support';
//                     db.query(dbQuery, (error, result) => {
//                       if (error) {
//                         console.error(error);
//                         res.status(500).json({ error: 'An error occurred while fetching WhatsApp numbers.' });
//                       } else {
//                         const supportWhatsAppData = result.map(row => {
//                           return {
//                             name: row.name,
//                             status: row.status,
//                             whatsappLink: `https://api.whatsapp.com/send/?phone=${row.whatsapp_number}&type=phone_number&app_absent=0`,
//                           };
//                         });

//                         // Insert the withdrawal request into the withdraw_requests table
//                         const withdrawalRequest = {
//                           user_id: userId,
//                           amount: amount,
//                           status: 'pending',
//                           timestamp: new Date()
//                         };

//                         const insertQuery = 'INSERT INTO withdraw_requests SET ?';
//                         db.query(insertQuery, withdrawalRequest, (error, result) => {
//                           if (error) {
//                             console.error(error);
//                             res.status(500).json({ error: 'An error occurred while submitting the withdrawal request.' });
//                           } else {
//                             // Update the user's daily withdrawal history
//                             const insertWithdrawalHistoryQuery = 'INSERT INTO withdraw_history (user_id, amount, date) VALUES (?, ?, ?)';
//                             db.query(insertWithdrawalHistoryQuery, [userId, amount, today], (historyError) => {
//                               if (historyError) {
//                                 console.error(historyError);
//                               }

//                               res.status(200).json({
//                                 message: 'Withdrawal request submitted for approval.',
//                                 supportWhatsAppData: supportWhatsAppData,
//                               });
//                             });
//                           }
//                         });
//                       }
//                     });
//                   }
//                 }
//               });
//             }
//           }
//         });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// };

const withdraw_amount_request = (req, res) => {
  try {
    const userId = req.body.userId;
    const amount = req.body.amount || 0;
    const withdrawPassword = req.body.withdrawPassword;

    

    const fetchWorkingHoursSql = "SELECT * FROM working_hours";

    db.query(fetchWorkingHoursSql, async (err, workingHoursResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    
      const workingHours = workingHoursResult[0];
    
      if (!workingHours) {
        return res.status(500).json({ error: "Working hours not found" });
      }
    
      // Get opening time and closing time using moment.js
      const openingTime = moment(workingHours.start_time, 'HH:mm:ss', true); // Add true to strict parsing
      const closingTime = moment(workingHours.end_time, 'HH:mm:ss', true);
    
      // Check if the parsing was successful
      if (!openingTime.isValid() || !closingTime.isValid()) {
        return res.status(400).json({ error: "Invalid time format" });
      }
    
      // Check if the current time is within opening hours
      const currentTime = moment();
      if (!currentTime.isBetween(openingTime, closingTime, null, '[]')) {
        const openingTimeFormatted = openingTime.format('HH:mm:ss');
        const closingTimeFormatted = closingTime.format('HH:mm:ss');
        return res.status(400).json({ error: `Opening hours ${openingTimeFormatted} - ${closingTimeFormatted}` });
      }
    
    
  //   // Define the operating hours (10:00 - 23:00) as time objects
  // const openingTime = new Date();
  // openingTime.setHours(10, 0, 0, 0);

  // const closingTime = new Date();
  // closingTime.setHours(23, 0, 0, 0);

  // // Get the current time
  // const currentTime = new Date();

  // // Check if the current time is within the operating hours
  // if (currentTime < openingTime || currentTime > closingTime) {
  //   return res.status(400).json({ error: "Opening hours 10:00:00 - 22:59:59" });
  // }
    // Fetch the stored hashed password, user level, and withdrawal information
    const getUserQuery =
      "SELECT u.withdraw_password, u.data_completed, u.level_id, l.level_name, l.max_data_limit, l.withdrawal_limit, l.max_withdrawals_per_day, u.balance FROM users u JOIN levels l ON u.level_id = l.level_id WHERE u.id = ?";
    db.query(getUserQuery, [userId], (passwordError, userResult) => {
      if (passwordError) {
        console.error(passwordError);
        res.status(500).json({
          error: "An error occurred while fetching user information.",
        });
      } else if (userResult.length === 0) {
        res.status(401).json({ error: "User not found." });
      } else {
        const user = userResult[0];
        const hashedPassword = user.withdraw_password;
        const dataCompleted = user.data_completed;
        const levelId = user.level_id;
        const levelName = user.level_name;
        const maxDataLimit = user.max_data_limit;
        const withdrawalLimit = user.withdrawal_limit;
        const maxWithdrawalsPerDay = user.max_withdrawals_per_day;
        const balance = user.balance;

        // Compare the provided withdrawPassword with the hashedPassword
        bcrypt.compare(
          withdrawPassword,
          hashedPassword,
          (compareError, passwordMatch) => {
            if (compareError) {
              console.error(compareError);
              res.status(500).json({
                error: "An error occurred while comparing passwords.",
              });
            } else if (!passwordMatch) {
              res.status(401).json({ error: "Withdraw fails, the withdrawl password is prompted to be incorrect!." });
            } else if (dataCompleted < maxDataLimit) {
              res.status(403).json({
                error: `The amount in your account can only be withdrawn after ${maxDataLimit} data of the current level (${levelName}) are completed.`,
              });
            } else if (amount > balance) {
              res.status(403).json({
                error: "Requested amount exceeds your available balance.",
              });
              
            }else if (amount < 10 ) {
              res.status(403).json({
                error: "The minimun withdraw amount is USDT 10.00",
              });
            }
               else {
              // Implement logic for withdrawal limit and maximum withdrawals per day based on user's level
              // Check if the withdrawal amount exceeds the user's withdrawal limit (0 indicates no limit)
              if (withdrawalLimit !== 0 && amount > withdrawalLimit) {
                res.status(403).json({
                  error: `Withdrawal amount exceeds your limit of ${withdrawalLimit} USDT.`,
                });
              } else {
                // Check if the user has reached the maximum number of daily withdrawals
                const today = new Date().toISOString().split("T")[0]; // Get the current date in ISO format
                const getUserWithdrawalsQuery =
                  "SELECT COUNT(*) AS dailyWithdrawalCount FROM withdraw_history WHERE user_id = ? AND date = ?";
                db.query(
                  getUserWithdrawalsQuery,
                  [userId, today],
                  (withdrawalError, withdrawalResult) => {
                    if (withdrawalError) {
                      console.error(withdrawalError);
                      res.status(500).json({
                        error:
                          "An error occurred while fetching withdrawal history.",
                      });
                    } else {
                      const dailyWithdrawalCount =
                        withdrawalResult[0].dailyWithdrawalCount || 0;

                      // Check if the user has exceeded the maximum number of daily withdrawals
                      if (dailyWithdrawalCount >= maxWithdrawalsPerDay) {
                        res.status(403).json({
                          error: `You have reached the maximum daily withdrawal limit of ${maxWithdrawalsPerDay} transactions.`,
                        });
                      } else {
                        // Proceed with the withdrawal process
                        // Save the withdrawal request in the withdraw_request table
                        const saveWithdrawalQuery =
                          "INSERT INTO withdraw_requests (user_id, amount, status) VALUES (?, ?, ?)";
                        db.query(
                          saveWithdrawalQuery,
                          [userId, amount, "pending"],
                          (saveError) => {
                            if (saveError) {
                              console.error(saveError);
                              res.status(500).json({
                                error:
                                  "An error occurred while saving the withdrawal request.",
                              });
                            } else {
                              // Fetch WhatsApp numbers and names from the customer_support table
                              const dbQuery = "SELECT * FROM customer_support";
                              db.query(dbQuery, (error, result) => {
                                if (error) {
                                  console.error(error);
                                  res.status(500).json({
                                    error:
                                      "An error occurred while fetching WhatsApp numbers.",
                                  });
                                } else {
                                  const supportWhatsAppData = result.map(
                                    (row) => {
                                      return {
                                        name: row.name,
                                        status: row.status,
                                        whatsappLink: `https://api.whatsapp.com/send/?phone=${row.whatsapp_number}&type=phone_number&app_absent=0`,
                                      };
                                    }
                                  );

                                  res.status(200).json({
                                    message:
                                      "Withdrawal request submitted for approval.",
                                    supportWhatsAppData: supportWhatsAppData,
                                  });
                                }
                              });
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }
          }
        );
      }
    });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// ####### WITHDRAW HISTORY API CODE BY USER

const get_withdraw_history_by_user = (req, res) => {
  try {
    const userId = req.params.userId;

    logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res.status(401).json({ error: "You are not authorized." });
    }

    // Query the database to retrieve withdrawal history for the specified user
    const historyQuery =
      "SELECT * FROM withdraw_history WHERE user_id = ? ORDER BY timestamp DESC";
    db.query(historyQuery, [userId], (historyError, historyResult) => {
      if (historyError) {
        console.error(historyError);
        res.status(500).json({
          error: "An error occurred while retrieving withdrawal history.",
        });
      } else {
        res.status(200).json({ withdrawalHistory: historyResult });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// update level API

// // Membership levels with balance ranges
// const membershipLevels = [
//   { name: 'Bronze', minBalance: 0, maxBalance: 1499.99 },
//   { name: 'Silver', minBalance: 1500, maxBalance: 2999.99 },
//   { name: 'Gold', minBalance: 3000, maxBalance: 4999.99 },
//   { name: 'Diamond', minBalance: 5000 }
// ];

// // Function to update user levels based on balance
// const update_user_level = () => {
//   membershipLevels.forEach(level => {
//     const updateLevelsQuery = `
//       UPDATE users
//       SET level_id = (SELECT level_id FROM levels WHERE level_name = ?)
//       WHERE balance >= ? AND (balance <= ? OR ? IS NULL);
//     `;

//     db.query(updateLevelsQuery, [level.name, level.minBalance, level.maxBalance, level.maxBalance], (err, result) => {
//       if (err) {
//         console.error('Error updating user levels:', err);
//       } else {
//         console.log(`Users in ${level.name} level updated:`, result.affectedRows, 'users');
//       }
//     });
//   });
// };

// // Schedule the cron job to run every minute (adjust the schedule as needed)
// cron.schedule('* * * * *', update_user_level);

// Membership levels with balance ranges
const membershipLevels = [
  { name: "Bronze", minBalance: 0, maxBalance: 1499.99 },
  { name: "Silver", minBalance: 1500, maxBalance: 2999.99 },
  { name: "Gold", minBalance: 3000, maxBalance: 4999.99 },
  { name: "Diamond", minBalance: 5000 },
];

// // Function to update user levels based on balance
// const update_user_level = () => {
//   membershipLevels.forEach(level => {
//     const updateLevelsQuery = `
//       UPDATE users
//       SET level_id = (SELECT level_id FROM levels WHERE level_name = ?)
//       WHERE balance >= ? AND (balance <= ? OR ? IS NULL)
//         AND (level_id IS NULL OR level_id < (SELECT level_id FROM levels WHERE level_name = ?));
//     `;

//     db.query(updateLevelsQuery, [level.name, level.minBalance, level.maxBalance, level.maxBalance, level.name], (err, result) => {
//       if (err) {
//         // console.error('Error updating user levels:', err);
//       } else {
//         // console.log(`Users in ${level.name} level updated:`, result.affectedRows, 'users');
//       }
//     });
//   });
// };

// // Schedule the cron job to run every minute (adjust the schedule as needed)
// cron.schedule('* * * * *', update_user_level);

const bind_wallet = async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      crypto_exchange_platform,
      usdt_trc20_address,
      phone,
    } = req.body;

    const logged_in_user_id = req.user.userId;

    if (user_id != logged_in_user_id) {
      return res.status(401).json({ error: "You are not authorized." });
    }

    // Check if any of the required fields are missing
    if (
      !full_name ||
      !crypto_exchange_platform ||
      !usdt_trc20_address ||
      !phone
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the user already has a bound wallet
    const existingWalletQuery = "SELECT * FROM bind_wallet WHERE user_id = ?";
    db.query(
      existingWalletQuery,
      [user_id],
      (existingWalletError, existingWalletResult) => {
        if (existingWalletError) {
          console.error(existingWalletError);
          return res.status(500).json({
            error: "An error occurred while checking existing wallet.",
          });
        }

        if (existingWalletResult.length > 0) {
          return res
            .status(400)
            .json({ error: "A wallet is already bound to this user." });
        }

        // Check if the user exists before binding the wallet
        const userQuery = "SELECT * FROM users WHERE ID = ?";
        db.query(userQuery, [user_id], (userError, userResult) => {
          if (userError) {
            console.error(userError);
            return res
              .status(500)
              .json({ error: "An error occurred while checking the user." });
          }

          if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found." });
          }

          // Insert wallet binding details into the bind_wallet table
          const bindWalletQuery =
            "INSERT INTO bind_wallet (user_id, full_name, crypto_exchange_platform, usdt_trc20_address, phone) VALUES (?, ?, ?, ?, ?)";
          db.query(
            bindWalletQuery,
            [
              user_id,
              full_name,
              crypto_exchange_platform,
              usdt_trc20_address,
              phone,
            ],
            (bindError, bindResult) => {
              if (bindError) {
                console.error(bindError);
                res.status(500).json({
                  error: "An error occurred while binding the wallet.",
                });
              } else {
                // Insert notification into the notifications table
                const notificationMessage = `Your wallet has been successfully bound.`;
                const insertNotificationQuery =
                  "INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, ?)";
                db.query(
                  insertNotificationQuery,
                  [user_id, notificationMessage, 0], // 0 means the notification is not read
                  (notificationError, notificationResult) => {
                    if (notificationError) {
                      console.error(notificationError);
                      res.status(500).json({
                        error:
                          "An error occurred while adding the notification.",
                      });
                    } else {
                      res
                        .status(200)
                        .json({ message: "Wallet successfully bound!" });
                    }
                  }
                );
              }
            }
          );
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

// ###### GET WALLET BY USER API CODE ############

const get_wallet_by_user = async (req, res) => {
  try {
    const user_id = req.params.userId;

    const logged_in_user_id = req.user.userId;

    if (user_id != logged_in_user_id) {
      return res.status(401).json({ error: "You are not authorized." });
    }

    // Query the database to retrieve wallet information for the user
    const query = "SELECT * FROM bind_wallet WHERE user_id = ?";
    db.query(query, [user_id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      } else {
        res.status(200).json({ walletData: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};







// Drive Data API
const drive_data = async (req, res) => {
  const { user_id } = req.body;
  let totalLimit;
  let frozen_target; // Add a variable to store the frozen_target

  try {

    const fetchWorkingHoursSql = "SELECT * FROM working_hours";

    db.query(fetchWorkingHoursSql, async (err, workingHoursResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    
      const workingHours = workingHoursResult[0];
    
      if (!workingHours) {
        return res.status(500).json({ error: "Working hours not found" });
      }
    
      // Get opening time and closing time using moment.js
      const openingTime = moment(workingHours.start_time, 'HH:mm:ss', true); // Add true to strict parsing
      const closingTime = moment(workingHours.end_time, 'HH:mm:ss', true);
    
      // Check if the parsing was successful
      if (!openingTime.isValid() || !closingTime.isValid()) {
        return res.status(400).json({ error: "Invalid time format" });
      }
    
      // Check if the current time is within opening hours
      const currentTime = moment();
      if (!currentTime.isBetween(openingTime, closingTime, null, '[]')) {
        const openingTimeFormatted = openingTime.format('HH:mm:ss');
        const closingTimeFormatted = closingTime.format('HH:mm:ss');
        return res.status(400).json({ error: `Opening hours ${openingTimeFormatted} - ${closingTimeFormatted}` });
      }
    
    
    // Define the operating hours (10:00 - 23:00) as time objects
  // const openingTime = new Date();
  // openingTime.setHours(10, 0, 0, 0);

  // const closingTime = new Date();
  // closingTime.setHours(23, 0, 0, 0);

  // // Get the current time
  // const currentTime = new Date();

  // // Check if the current time is within the operating hours
  // if (currentTime < openingTime || currentTime > closingTime) {
  //   return res.status(400).json({ error: "Opening hours 10:00:00 - 22:59:59" });
  // }
    // Check if there are any pending statuses for the user's products
    const checkStatusSql =
      'SELECT COUNT(*) AS pending_count FROM user_products WHERE user_id = ? AND status = "pending"';
    db.query(checkStatusSql, [user_id], async (err, statusResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const pendingCount = statusResult[0].pending_count;

      if (pendingCount > 0) {
        // At least one product has a "pending" status, return an error
        return res.status(400).json({
          error:
            "Kindly submit the previous data before proceeding with the next data",
        });
      }

      // Check if the user has a merged product
      const checkMergedProductSql =
        'SELECT COUNT(*) AS merged_count FROM user_products WHERE user_id = ? AND status = "merged"';
      db.query(checkMergedProductSql, [user_id], async (err, mergedResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        const mergedCount = mergedResult[0].merged_count;

        if (mergedCount > 0) {
          // User has a merged product, cannot drive new data
          return res.status(400).json({ error: "Kindly submit the previous data before proceeding with the next data", });
        }

        // Fetch user details
        const fetchUserSql = "SELECT * FROM users WHERE id = ?";
        db.query(fetchUserSql, [user_id], async (err, userResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          const userDetails = userResult[0];

          if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
          }

          // Check if user's balance is sufficient
          if (userDetails.balance < 50) {
            return res.status(400).json({ error: "Account balance below 50.00 USDT,not able for start data" });
          }

          // Check if the user has reached the maximum sets per day
          if (userDetails.sets_completed_today >= 2) {
            return res
              .status(400)
              .json({ error: "You have reached the maximun set per day, please request a withdraw and contact the customer support to register you for the day." });
          }

          // Fetch user's level details
          const fetchLevelSql = "SELECT * FROM levels WHERE level_id = ?";
          db.query(
            fetchLevelSql,
            [userDetails.level_id],
            async (err, levelResult) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
              }

              const userLevel = levelResult[0];

              if (!userLevel) {
                return res.status(404).json({ error: "User level not found" });
              }

              totalLimit = userLevel.max_data_limit;

           

              // Fetch frozen_target from user_frozen_products
              const fetchFrozenTargetSql =
                "SELECT frozen_target FROM user_frozen_products WHERE user_id = ?";
              db.query(
                fetchFrozenTargetSql,
                [user_id],
                async (err, frozenTargetResult) => {
                  if (err) {
                    console.error(err);
                    return res
                      .status(500)
                      .json({ error: "Internal server error" });
                  }

                  frozen_target = frozenTargetResult[0] && frozenTargetResult[0].frozen_target || 0; // Use 0 as default

                  // Fetch frozen_target from user_frozen_products
                  const fetchMergedTargetSql =
                    "SELECT merge_target FROM user_merged_products WHERE user_id = ?";
                  db.query(
                    fetchMergedTargetSql,
                    [user_id],
                    async (err, mergedTargetResult) => {
                      if (err) {
                        console.error(err);
                        return res
                          .status(500)
                          .json({ error: "Internal server error" });
                      }

                      merge_target = mergedTargetResult[0] && mergedTargetResult[0].merge_target || 0; // Use 0 as default

                      // Check if user has reached their maximum data limit in the current set
                      if (userDetails.data_completed >= totalLimit) {
                        // Check if there's another set available
                        if (userDetails.sets_completed_today < 1) {
                          // Start a new set
                          // Update user's sets completed today count
                          const updatedSetsCompletedToday =
                            userDetails.sets_completed_today;

                          // Reset user's data completed count
                          const updatedDataCompleted = 0;

                          const startNewSetSql =
                            "UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?";
                          db.query(
                            startNewSetSql,
                            [
                              updatedDataCompleted,
                              updatedSetsCompletedToday,
                              user_id,
                            ],
                            async (err) => {
                              if (err) {
                                console.error(err);
                                return res
                                  .status(500)
                                  .json({ error: "Internal server error" });
                              }

                              // Continue assigning products to the user in the new set
                              assignData(
                                user_id,
                                userDetails,
                                userLevel,
                                totalLimit,
                                frozen_target,
                                merge_target,
                                res
                              );
                            }
                          );
                        } else {
                          // No more sets available for today
                          return res.status(400).json({
                            error: `User has completed ${totalLimit} Rating, Please contact Customer Service to request a withdrawal and confirm the reset account for the day`,
                          });
                        }
                      } else {
                        // Continue assigning products to the user in the current set
                        assignData(
                          user_id,
                          userDetails,
                          userLevel,
                          totalLimit,
                          frozen_target,
                          merge_target,
                          res
                        );
                      }
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignData = (user_id, userDetails, userLevel, totalLimit, frozen_target, merge_target, res) => {
  const driveData = userDetails.data_completed + 1;
  const remainingLimit = totalLimit - userDetails.data_completed;
  
  const updatedSetsCompletedToday =
    userDetails.data_completed + 1 >= totalLimit
      ? userDetails.sets_completed_today + 1
      : userDetails.sets_completed_today;
     
  // Check if driveData is equal to frozen_target
  if (driveData === frozen_target) {
    // Fetch a product from user_frozen_products
    const fetchFrozenProductSql = `
      SELECT ufp.product_id, p.*
      FROM user_frozen_products AS ufp
      LEFT JOIN products AS p ON ufp.product_id = p.product_id
      WHERE ufp.user_id = ? 
      LIMIT 1
    `;
    db.query(fetchFrozenProductSql, [user_id], async (err, frozenProductResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const frozenProduct = frozenProductResult[0];

      if (frozenProduct && frozenProduct.product_id) {
        // Calculate commission based on the user's level for the frozen product
        let dataCommission = 0;
        if (userLevel.level_id === 1) {
          dataCommission = 0.005; // 0.5%
        } else if (userLevel.level_id === 2) {
          dataCommission = 0.01; // 1.0%
        } else if (userLevel.level_id === 3) {
          dataCommission = 0.015; // 1.5%
        } else if (userLevel.level_id === 4) {
          dataCommission = 0.02; // 2.0%
        }

        const commission = frozenProduct.product_price * dataCommission;

        // Assign the frozen product to the user
        const assignFrozenProductSql = `
          INSERT INTO user_products (user_id, product_id, commission, status)
          VALUES (?, ?, ?, 'pending')
        `;
        db.query(
          assignFrozenProductSql,
          [user_id, frozenProduct.product_id, commission],
          async (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            }

            // Update data_completed after assigning the frozen product
            const updateDataCompletedSql = "UPDATE users SET data_completed = ? WHERE id = ?";
            db.query(updateDataCompletedSql, [driveData, user_id], async (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
              }
              
              
              const updatedBalance = userDetails.balance - frozenProduct.product_price;

      
              // Update user's balance
              const updateUserSql = "UPDATE users SET balance = ? WHERE id = ?";
              db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Internal server error" });
                }

              res.status(200).json({
                message: "Frozen Product assigned successfully",
                selected_product: frozenProduct,
                drive_data: `${driveData}/${totalLimit}`,
                remaining_limit: remainingLimit,
                commission: commission,
              });
            });
            });
          }
        );
      } else {
        res.status(200).json({
          message: "No frozen product available",
          drive_data: `${driveData}/${totalLimit}`,
          remaining_limit: remainingLimit,
          commission: 0, // Commission is 0 for non-assigned products
        });
      }
    });
  } else if (driveData === merge_target) {
    // Check if driveData is equal to merge_target
    const mergeProductSql = `
      SELECT ump.product_id, p.product_price
      FROM user_merged_products AS ump
      LEFT JOIN products AS p ON ump.product_id = p.product_id
      WHERE ump.user_id = ? 
      LIMIT 1
    `;
    db.query(mergeProductSql, [user_id], async (err, mergeProductResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const mergeProduct = mergeProductResult[0];

      if (mergeProduct && mergeProduct.product_id) {
        // Calculate commission based on the user's level for merged data
        let mergeCommission = 0;
        if (userLevel.level_id === 1) {
          mergeCommission = 0.015; // 1.5%
        } else if (userLevel.level_id === 2) {
          mergeCommission = 0.03; // 3.0%
        } else if (userLevel.level_id === 3) {
          mergeCommission = 0.045; // 4.5%
        } else if (userLevel.level_id === 4) {
          mergeCommission = 0.06; // 6.0%
        }

        // Deduct product_price from the user's balance
        const updatedBalance = userDetails.balance - mergeProduct.product_price;
        const merged_commission = mergeProduct.product_price * mergeCommission

        // Insert the product into user_products with a status of "merged"
        const assignMergeProductSql = `
          INSERT INTO user_products (user_id, product_id, commission, status)
          VALUES (?, ?, ?, 'merged')
        `;
        db.query(assignMergeProductSql, [user_id, mergeProduct.product_id, merged_commission], async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Update the user's balance
          const updateUserSql = "UPDATE users SET balance = ? WHERE id = ?";
          db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            }

            // Update data_completed after hitting merge_target
            const updateDataCompletedSql = "UPDATE users SET data_completed = ? WHERE id = ?";
            db.query(updateDataCompletedSql, [driveData, user_id], async (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
              }

              // Find the latest completed product
              const findLatestCompletedProductSql = `
                SELECT up.product_id,up.commission, p.product_price
                FROM user_products AS up
                LEFT JOIN products AS p ON up.product_id = p.product_id
                WHERE up.user_id = ? AND up.status = 'completed'
                ORDER BY up.created_at DESC
                LIMIT 1
              `;
              db.query(findLatestCompletedProductSql, [user_id], async (err, latestCompletedProductResult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Internal server error" });
                }

                const latestCompletedProduct = latestCompletedProductResult[0];

                if (latestCompletedProduct && latestCompletedProduct.product_id) {
                  // Update the user's balance
                  const getLatestBalanceSql = "SELECT balance FROM users WHERE id = ?";
                  db.query(getLatestBalanceSql, [user_id], async (err, latestBalance) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ error: "Internal server error" });
                    }
                    latestBalance = latestBalance[0].balance;

                    const updatedBalance = latestBalance - latestCompletedProduct.product_price - latestCompletedProduct.commission;
                    

                    // Update the user's balance
                    const updateUserSql = "UPDATE users SET balance = ? WHERE id = ?";
                    db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Internal server error" });
                      }

                      // Update the status of the latest completed product to "frozen"
                      const updateLatestCompletedProductSql = `
                        UPDATE user_products
                        SET status = 'frozen'
                        WHERE user_id = ? AND product_id = ? ORDER BY created_at DESC
                        LIMIT 1
                      `;
                      db.query(updateLatestCompletedProductSql, [user_id, latestCompletedProduct.product_id], async (err) => {
                        if (err) {
                          console.error(err);
                          return res.status(500).json({ error: "Internal server error" });
                        }

                        res.status(200).json({
                          message: "Product merged successfully",
                          merged_product: mergeProduct,
                          drive_data: `${driveData}/${totalLimit}`,
                          remaining_limit: remainingLimit,
                          
                        });
                      });
                    });
                  });
                } else {
                  res.status(200).json({
                    message: "No completed product found to freeze",
                    drive_data: `${driveData}/${totalLimit}`,
                    remainingLimit: remainingLimit,
                  });
                }
              });
            });
          });
        });
      } else {
        res.status(200).json({
          message: "No merge product available",
          drive_data: `${driveData}/${totalLimit}`,
          remaining_limit: remainingLimit,
        });
      }
    });
  } else {
    // Continue assigning regular products to the user
    const fetchProductsSql = `
      SELECT * FROM products
      WHERE product_price >= ? * 0.25 AND product_price <= ?
      ORDER BY RAND() LIMIT 1
    `;

    db.query(fetchProductsSql, [userDetails.balance, userDetails.balance], async (err, productsResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const selectedProduct = productsResult[0];

      if (!selectedProduct) {
        // No suitable products found, start from the beginning
        db.query("DELETE FROM user_products WHERE user_id = NULL", [user_id], async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          assignData(user_id, userDetails, userLevel, totalLimit, frozen_target, merge_target, res);
        });
      }

      // Calculate commission based on the user's level for regular products
      let dataCommission = 0;
      if (userLevel.level_id === 1) {
        dataCommission = 0.005; // 0.5%
      } else if (userLevel.level_id === 2) {
        dataCommission = 0.01; // 1.0%
      } else if (userLevel.level_id === 3) {
        dataCommission = 0.015; // 1.5%
      } else if (userLevel.level_id === 4) {
        dataCommission = 0.02; // 2.0%
      }

      const data_Commission = selectedProduct.product_price * dataCommission

      // Assign the regular product to the user if a product is available
      const assignProductSql = `
        INSERT INTO user_products (user_id, product_id, commission, status)
        VALUES (?, ?, ?, 'pending')
      `;
      db.query(assignProductSql, [user_id, selectedProduct.product_id, data_Commission], async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Calculate driveData based on the updated data_completed count
        const driveData = userDetails.data_completed + 1;
        const updatedBalance = userDetails.balance - selectedProduct.product_price;

        // Update user's balance
        const updateUserSql = "UPDATE users SET balance = ? WHERE id = ?";
        db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Update the user's data_completed count and sets_completed_today count in the database
          const updateUserStatsSql = `
            UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?
          `;
          db.query(updateUserStatsSql, [userDetails.data_completed + 1, updatedSetsCompletedToday, user_id], async (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            }

            res.status(200).json({
              message: "Product assigned successfully",
              selected_product: selectedProduct,
              drive_data: `${driveData}/${totalLimit}`,
              remaining_limit: remainingLimit,
              commission: data_Commission,
            });
          });
        });
      });
    });
  }
};


// Define an API route for submitting data
const submit_data = async (req, res) => {
  const { user_id } = req.body;

  // Initialize variables to store user balance and commission
  let userBalance = 0;
  let userCommission = 0;

  // Query the users table to retrieve user balance and commission
  const getUserBalanceAndCommissionSql = `
    SELECT balance, commission
    FROM users
    WHERE id = ?
  `;

  db.query(getUserBalanceAndCommissionSql, [user_id], async (err, userResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (userResult.length === 1) {
      // Get user balance and commission from the query result
      userBalance = userResult[0].balance;
      userCommission = userResult[0].commission;
    } else {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if there are pending products for the user, including frozen and merged
    const checkPendingProductsSql = `
      SELECT up.*, p.product_name, p.product_price, p.product_id, p.product_price, p.product_description, p.product_image_url
      FROM user_products AS up
      JOIN products AS p ON up.product_id = p.product_id
      WHERE up.user_id = ? AND (up.status = "pending" OR up.status = "merged" OR up.status = "frozen")
    `;

    db.query(checkPendingProductsSql, [user_id], async (err, pendingProducts) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (pendingProducts.length === 0) {
        return res.status(400).json({ error: "No pending products to submit" });
      }

      // Calculate the total price, total commission, and frozen/merged commissions
      let totalPrice = 0;
      let totalCommission = 0;
      let totalFrozenProductPrice = 0;
      let totalMergedProductPrice = 0;

      for (const product of pendingProducts) {
        totalPrice += product.product_price;
        totalCommission += product.commission;

        // Check if the product is frozen or merged
        if (product.status === "frozen") {
          totalFrozenProductPrice += product.product_price;
        } else if (product.status === "merged") {
          totalMergedProductPrice += product.product_price;
        }
      }

      // Update user's balance, total commission, and frozen/merged commissions in the users table
      const updateUserBalanceSql = `
        UPDATE users
        SET balance = ?, commission = ?
        WHERE id = ?
      `;

      db.query(
        updateUserBalanceSql,
        [
          userBalance + totalPrice + totalCommission,
          userCommission + totalCommission,
          user_id,
        ],
        async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Update the status to "completed" in user_products table
          const updateProductsSql = `
            UPDATE user_products
            SET status = "completed"
            WHERE user_id = ? AND (status = "pending" OR status = "merged" OR status = "frozen")
          `;

          db.query(updateProductsSql, [user_id], async (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            }


            res.status(200).json({
              message: "Data submitted successfully",
              total_price: totalPrice,
              total_commission: totalCommission,
              total_frozen_commission: totalFrozenProductPrice,
              total_merged_commission: totalMergedProductPrice,
            });
          });
        }
      );
    });
  });
};





// GET ALL DATA

const get_all_data = (req, res) => {
  const { user_id } = req.params;

  // Query to retrieve all data for the user with commissions
  const query = `
    SELECT up.*, p.product_name, p.product_description, p.product_image_url, p.product_price, l.commission_per_data, l.merge_commission, u.level_id
    FROM user_products AS up
    JOIN products AS p ON up.product_id = p.product_id
    JOIN users AS u ON up.user_id = u.id
    JOIN levels AS l ON u.level_id = l.level_id
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching all data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Calculate the commission for each product
    const dataWithCommissions = results.map((result) => {
      const productPrice = result.product_price;
      const commissionPerData = result.commission_per_data;
      const mergeCommission = result.merge_commission;
      const levelId = result.level_id;

      // Calculate the commission for the product based on the user's level
      let commission = 0;
      if (levelId === 1) {
        // Bronze Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
      } else if (levelId === 2) {
        // Silver Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 3) {
        // Gold Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 4) {
        // Diamond Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      }

      // Add the calculated commission to the result
      result.commission = commission;

      return result;
    });

    res.status(200).json({ dataWithCommissions });
  });
};

//  GET PENDING DATA

const get_pending_data = (req, res) => {
  const { user_id } = req.params;

  // Query to retrieve all pending data for the user with commissions
  const query = `
    SELECT up.*, p.product_name, p.product_description, p.product_image_url, p.product_price, l.commission_per_data, l.merge_commission, u.level_id
    FROM user_products AS up
    JOIN products AS p ON up.product_id = p.product_id
    JOIN users AS u ON up.user_id = u.id
    JOIN levels AS l ON u.level_id = l.level_id
    WHERE up.status = 'pending'
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching pending data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Calculate the commission for each product
    const dataWithCommissions = results.map((result) => {
      const productPrice = result.product_price;
      const commissionPerData = result.commission_per_data;
      const mergeCommission = result.merge_commission;
      const levelId = result.level_id;

      // Calculate the commission for the product based on the user's level
      let commission = 0;
      if (levelId === 1) {
        // Bronze Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
      } else if (levelId === 2) {
        // Silver Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 3) {
        // Gold Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 4) {
        // Diamond Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      }

      // Add the calculated commission to the result
      result.commission = commission;

      return result;
    });

    res.status(200).json({ dataWithCommissions });
  });
};





//  GET Completed DATA

const get_completed_data = (req, res) => {
  const { user_id } = req.params;

  // Query to retrieve all pending data for the user with commissions
  const query = `
    SELECT up.*, p.product_name, p.product_description, p.product_image_url, p.product_price, l.commission_per_data, l.merge_commission, u.level_id
    FROM user_products AS up
    JOIN products AS p ON up.product_id = p.product_id
    JOIN users AS u ON up.user_id = u.id
    JOIN levels AS l ON u.level_id = l.level_id
    WHERE up.status = 'completed'
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching pending data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Calculate the commission for each product
    const dataWithCommissions = results.map((result) => {
      const productPrice = result.product_price;
      const commissionPerData = result.commission_per_data;
      const mergeCommission = result.merge_commission;
      const levelId = result.level_id;

      // Calculate the commission for the product based on the user's level
      let commission = 0;
      if (levelId === 1) {
        // Bronze Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
      } else if (levelId === 2) {
        // Silver Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 3) {
        // Gold Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 4) {
        // Diamond Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      }

      // Add the calculated commission to the result
      result.commission = commission;

      return result;
    });

    res.status(200).json({ dataWithCommissions });
  });
};

//  GET FROZEN DATA

const get_frozen_data = (req, res) => {
  const { user_id } = req.params;

  // Query to retrieve all pending data for the user with commissions
  const query = `
    SELECT up.*, p.product_name, p.product_description, p.product_image_url, p.product_price, l.commission_per_data, l.merge_commission, u.level_id
    FROM user_products AS up
    JOIN products AS p ON up.product_id = p.product_id
    JOIN users AS u ON up.user_id = u.id
    JOIN levels AS l ON u.level_id = l.level_id
    WHERE up.status = 'frozen'
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching pending data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Calculate the commission for each product
    const dataWithCommissions = results.map((result) => {
      const productPrice = result.product_price;
      const commissionPerData = result.commission_per_data;
      const mergeCommission = result.merge_commission;
      const levelId = result.level_id;

      // Calculate the commission for the product based on the user's level
      let commission = 0;
      if (levelId === 1) {
        // Bronze Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
      } else if (levelId === 2) {
        // Silver Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 3) {
        // Gold Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      } else if (levelId === 4) {
        // Diamond Membership Commission Calculation
        commission = productPrice * (commissionPerData / 100);
        if (mergeCommission && result.merged) {
          commission += productPrice * (mergeCommission / 100);
        }
      }

      // Add the calculated commission to the result
      result.commission = commission;

      return result;
    });

    res.status(200).json({ dataWithCommissions });
  });
};

// const get_transactions_by_status = (req, res) => {
//   const { user_id, status } = req.params;

//   let statusFilter = "";
//   if (status === "pending") {
//     statusFilter = "AND up.status = 'pending'";
//   } else if (status === "completed") {
//     statusFilter = "AND up.status = 'completed'";
//   } else if (status === "frozen") {
//     statusFilter = "AND up.status = 'frozen'";
//   }

//   // Query to retrieve transactions based on status
//   const query = `
//     SELECT up.*, p.product_name, p.product_description, p.product_image_url, p.product_price, l.commission_per_data, l.merge_commission, u.level_id
//     FROM user_products AS up
//     JOIN products AS p ON up.product_id = p.product_id
//     JOIN users AS u ON up.user_id = u.id
//     JOIN levels AS l ON u.level_id = l.level_id
//     WHERE up.user_id = ? ${statusFilter} ORDER BY up.created_at DESC
//   `;

//   db.query(query, [user_id], (err, results) => {
//     if (err) {
//       console.error(`Error fetching ${status} data:`, err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // Calculate the commission for each product
//     const dataWithCommissions = results.map((result) => {
//       const productPrice = result.product_price;
//       const commissionPerData = result.commission_per_data;
//       const mergeCommission = result.merge_commission;
//       const levelId = result.level_id;

//       // Calculate the commission for the product based on the user's level
//       let commission = 0;
//       if (levelId === 1) {
//         // Bronze Membership Commission Calculation
//         commission = productPrice * (commissionPerData / 100);
//       } else if (levelId >= 2 && levelId <= 4) {
//         // Silver, Gold, and Diamond Membership Commission Calculation
//         commission = productPrice * (commissionPerData / 100);
//         if (mergeCommission && result.merged) {
//           commission += productPrice * (mergeCommission / 100);
//         }
//       }

//       // Add the calculated commission to the result
//       result.commission = commission;

//       return result;
//     });

//     res.status(200).json({ dataWithCommissions });
//   });
// };

const get_transactions_by_status = (req, res) => {
  const { user_id, status } = req.params;

  let statusFilter = "";
  if (status === "pending") {
    statusFilter = "AND (up.status = 'pending' OR up.status = 'merged')";
  } else if (status === "completed") {
    statusFilter = "AND up.status = 'completed'";
  } else if (status === "frozen") {
    statusFilter = "AND up.status = 'frozen'";
  }

  // Query to retrieve transactions based on status
  const query = `
      SELECT up.*, p.product_name, p.product_description, p.product_image_url, p.product_price, l.commission_per_data, l.merge_commission, u.level_id
      FROM user_products AS up
      JOIN products AS p ON up.product_id = p.product_id
      JOIN users AS u ON up.user_id = u.id
      JOIN levels AS l ON u.level_id = l.level_id
      WHERE up.user_id = ? ${statusFilter} ORDER BY up.created_at DESC
    `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error(`Error fetching ${status} data:`, err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Calculate the commission for each product
    const dataWithCommissions = results.map((result) => {
      const productPrice = result.product_price;
      const commission = result.commission;
      const commissionPerData = result.commission_per_data;
      const mergeCommission = result.merge_commission;
      const levelId = result.level_id;

      // // Calculate the commission for the product based on the user's level
      // let commission = 0;
      // if (levelId === 1) {
      //   // Bronze Membership Commission Calculation
      //   commission = productPrice * (commissionPerData / 100);
      // } else if (levelId >= 2 && levelId <= 4) {
      //   // Silver, Gold, and Diamond Membership Commission Calculation
      //   if (result.status === "merged" && mergeCommission) {
      //     // Use merge commission if the product is merged
      //     commission = productPrice * (mergeCommission / 100);
      //   } else {
      //     // Use simple commission for other cases
      //     commission = productPrice * (commissionPerData / 100);
      //   }
      // }

      // Calculate the commission for the product based on the user's level and result status
      // let commission = 0;
      // if (levelId >= 1 && levelId <= 4) {
      //   // Bronze Membership Commission Calculation
      //   if (result.status === "pending" || result.status === "completed") {
      //     commission = productPrice * (commissionPerData / 100);
      //   }
      // } else {
      //   // Silver, Gold, and Diamond Membership Commission Calculation
      //   if (result.status === "merged" && mergeCommission) {
      //     // Use merge commission if the product is merged
      //     commission = productPrice * (mergeCommission / 100);
      //   }
      // }

      // The commission variable will now be calculated based on the conditions you described.

      // Add the calculated commission to the result
      // result.commission = commission;

      return result;
    });

    res.status(200).json({ dataWithCommissions });
  });
};

// SUBMIT DATA API CODE

// const submit_data = (req, res) => {
//   const { user_id, product_id } = req.body;

//   // Fetch user details
//   db.query("SELECT * FROM users WHERE id = ?", [user_id], (err, userResult) => {
//     if (err) {
//       console.error("Error fetching user details:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     const user = userResult[0];

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if the user has a merged product and balance is insufficient
//     if (user.balance < 0) {
//       return res
//         .status(400)
//         .json({
//           error:
//             "You have low balance, kindly make a deposit to your account by contacting Customer Support",
//         });
//     }

//     // Fetch pending product details
//     db.query(
//       `
//         SELECT * FROM user_products WHERE user_id = ? AND status IN ('merged', 'frozen', 'pending')
//         ORDER BY FIELD(status, 'merged', 'frozen', 'pending')
//         LIMIT 1
//         `,
//       [user_id],
//       (err, userProductResult) => {
//         if (err) {
//           console.error("Error fetching user products:", err);
//           return res.status(500).json({ error: "Internal server error" });
//         }

//         const userProduct =
//           userProductResult.length > 0 ? userProductResult[0] : null;

//         if (!userProduct) {
//           return res.status(200).json({ message: "No pending product found" });
//         }

//         db.query(
//           `
//             SELECT up.*, p.*
//             FROM user_products AS up
//             JOIN products AS p ON up.product_id = p.product_id
//             WHERE up.user_id = ? AND up.status = "frozen"
//             `,
//           [user_id],
//           (err, frozenProductResult) => {
//             if (err) {
//               console.error("Error fetching user products:", err);
//               return res.status(500).json({ error: "Internal server error" });
//             }

//             const frozenProduct =
//               frozenProductResult.length > 0 ? frozenProductResult[0] : null;

//             // console.log( frozenProduct && frozenProduct)
//             // console.log( frozenProduct && frozenProduct.status)
//             // console.log( frozenProduct && frozenProduct.product_price)

//             if (!frozenProductResult) {
//               return res
//                 .status(200)
//                 .json({ message: "No frozen product found" });
//             }

//             const { product_id } = userProduct;

//             // Fetch product details
//             db.query(
//               "SELECT * FROM products WHERE product_id = ?",
//               [product_id],
//               (err, productResult) => {
//                 if (err) {
//                   console.error("Error fetching product details:", err);
//                   return res
//                     .status(500)
//                     .json({ error: "Internal server error" });
//                 }

//                 const product = productResult[0];

//                 if (!product) {
//                   return res.status(404).json({ error: "Product not found" });
//                 }

//                 db.query(
//                   "SELECT * FROM levels WHERE level_id = ?",
//                   [user.level_id],
//                   (err, levelResult) => {
//                     if (err) {
//                       console.error("Error fetching level:", err);
//                       return res
//                         .status(500)
//                         .json({ error: "Internal server error" });
//                     }

//                     const userLevel = levelResult[0];

//                     // // Calculate commission based on user's level, product price, and commission per data
//                     // let commission = 0;
//                     // if (user.level_id === 1) {
//                     //   // Bronze Membership Commission Calculation
//                     //   commission = product.product_price * 0.005; // 0.5% commission per data
//                     //   if (userProduct.status === "merged" && userLevel.merge_commission) {
//                     //     commission += product.product_price * 0.15; // 1.5% commission for merge data
//                     //   }
//                     // } else if (user.level_id === 2) {
//                     //   // Silver Membership Commission Calculation
//                     //   commission = product.product_price * 0.01; // 1.0% commission per data
//                     //   if (userProduct.status === "merged" && userLevel.merge_commission) {
//                     //     commission += product.product_price * 0.03; // 3.0% commission for merge data
//                     //   }
//                     // } else if (user.level_id === 3) {
//                     //   // Gold Membership Commission Calculation
//                     //   commission = product.product_price * 0.015; // 1.5% commission per data
//                     //   if (userProduct.status === "merged" && userLevel.merge_commission) {
//                     //     commission += product.product_price * 0.045; // 4.5% commission for merge data
//                     //   }
//                     // } else if (user.level_id === 4) {
//                     //   // Diamond Membership Commission Calculation
//                     //   commission = product.product_price * 0.02; // 2.0% commission per data
//                     //   if (userProduct.status === "merged" && userLevel.merge_commission) {
//                     //     commission = product.product_price * 0.06; // 6.0% commission for merge data
//                     //   }
//                     // }

//                     // commission = commission

//                     // Calculate commission based on user's level, product price, and commission per data
//                     let commission = 0;
//                     if (user.level_id === 1) {
//                       // Bronze Membership Commission Calculation
//                       commission = product.product_price * 0.005; // 0.5% commission per data
//                       if (
//                         userProduct.status === "merged" &&
//                         userLevel.merge_commission
//                       ) {
//                         commission = product.product_price * 0.15; // 1.5% commission for merge data
//                       }
//                     } else if (user.level_id === 2) {
//                       // Silver Membership Commission Calculation
//                       commission = product.product_price * 0.01; // 1.0% commission per data
//                       if (
//                         userProduct.status === "merged" &&
//                         userLevel.merge_commission
//                       ) {
//                         commission = product.product_price * 0.03; // 3.0% commission for merge data
//                       }
//                     } else if (user.level_id === 3) {
//                       // Gold Membership Commission Calculation
//                       commission = product.product_price * 0.015; // 1.5% commission per data
//                       if (
//                         userProduct.status === "merged" &&
//                         userLevel.merge_commission
//                       ) {
//                         commission = product.product_price * 0.045; // 4.5% commission for merge data
//                       }
//                     } else if (user.level_id === 4) {
//                       // Diamond Membership Commission Calculation
//                       commission = product.product_price * 0.02; // 2.0% commission per data
//                       if (
//                         userProduct.status === "merged" &&
//                         userLevel.merge_commission
//                       ) {
//                         commission = product.product_price * 0.06; // 6.0% commission for merge data
//                       }
//                     }

//                     // if ( frozenProduct && frozenProduct.status === "frozen" && userLevel.commission_per_data) {
//                     //   commission = frozenProduct.product_price * 0.06; // 6.0% commission for merge data
//                     // }

//                     let frozenProductPrice = 0;
//                     let frozenProductcommission = 0;

//                     if (frozenProduct && frozenProduct.status === "frozen") {
//                       db.query(
//                         "DELETE FROM user_merge_targets WHERE id = (SELECT MIN(id) FROM user_merge_targets WHERE user_id = ? LIMIT 1)",
//                         [user_id],
//                         (err, result) => {
//                           if (err) {
//                             console.error("Error clearing merge_target:", err);
//                             return res
//                               .status(500)
//                               .json({ error: "Internal server error" });
//                           }
//                           // Your success handling code here
//                         }
//                       );

//                       frozenProductPrice = frozenProduct.product_price;
//                       frozenProductcommission =
//                         frozenProduct.product_price * 0.02; // 2.0% commission for merge data
//                       // frozenProductcommission = commission
//                     }

//                     // console.log("frozen commission", frozenProductcommission)

//                     // Update user's balance and commission for the current product
//                     let updatedBalance =
//                       user.balance +
//                       product.product_price +
//                       frozenProductPrice +
//                       frozenProductcommission +
//                       commission;
//                     let updatedCommission =
//                       user.commission + commission + frozenProductcommission;

//                     // Update the status of frozen products to 'completed'
//                     db.query(
//                       "UPDATE user_products SET status = ?, commission = ? WHERE user_id = ? AND status = ?",
//                       ["completed", frozenProductcommission, user_id, "frozen"],
//                       (err) => {
//                         if (err) {
//                           console.error(
//                             "Error updating frozen product status:",
//                             err
//                           );
//                           return res
//                             .status(500)
//                             .json({ error: "Internal server error" });
//                         }

//                         // Update the status of merged products to 'completed'
//                         db.query(
//                           "UPDATE user_products SET status = ?, commission = ? WHERE user_id = ? AND status = ?",
//                           ["completed", commission, user_id, "merged"],
//                           (err) => {
//                             if (err) {
//                               console.error(
//                                 "Error updating merged product status:",
//                                 err
//                               );
//                               return res
//                                 .status(500)
//                                 .json({ error: "Internal server error" });
//                             }

//                             // Update user's balance and commission in the database
//                             db.query(
//                               "UPDATE users SET balance = ?, commission = ? WHERE id = ?",
//                               [updatedBalance, updatedCommission, user_id],
//                               (err) => {
//                                 if (err) {
//                                   console.error(
//                                     "Error updating user balance and commission:",
//                                     err
//                                   );
//                                   return res
//                                     .status(500)
//                                     .json({ error: "Internal server error" });
//                                 }

//                                 // Update the status of the user_product to 'completed'
//                                 db.query(
//                                   "UPDATE user_products SET status = ? WHERE user_id = ?",
//                                   ["completed", user_id],
//                                   (err) => {
//                                     if (err) {
//                                       console.error(
//                                         "Error updating user_product status:",
//                                         err
//                                       );
//                                       return res
//                                         .status(500)
//                                         .json({
//                                           error: "Internal server error",
//                                         });
//                                     }

//                                     res
//                                       .status(200)
//                                       .json({
//                                         message: "Data submitted successfully",
//                                       });
//                                   }
//                                 );
//                               }
//                             );
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// };

//   const calculateCommission = (level_id, product_price, merge_commission) => {
//   let commission = 0;
//   if (level_id === 1) {
//     // Bronze Membership Commission Calculation
//     commission = product_price * 0.005; // 0.5% commission per data
//   } else if (level_id >= 2 && level_id <= 4) {
//     // Silver, Gold, and Diamond Membership Commission Calculation
//     commission = product_price * 0.01; // 1.0% commission per data
//     if (merge_commission) {
//       commission += product_price * 0.03; // 3.0% commission for merge data
//     }
//     if (level_id === 3) {
//       // Gold Membership Commission Calculation
//       commission = product_price * 0.015; // 1.5% commission per data
//       if (merge_commission) {
//         commission += product_price * 0.045; // 4.5% commission for merge data
//       }
//     } else if (level_id === 4) {
//       // Diamond Membership Commission Calculation
//       commission = product_price * 0.02; // 2.0% commission per data
//       if (merge_commission) {
//         commission += product_price * 0.06; // 6.0% commission for merge data
//       }
//     }
//   }

//   return commission;
// };

// const submit_data = (req, res) => {
//   const { user_id } = req.body;

//   // Fetch user details
//   db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, userResult) => {
//     if (err) {
//       console.error('Error fetching user details:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     const user = userResult[0];

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if the user has a merged product and balance is insufficient
//     if (user.balance < 0) {
//       return res.status(400).json({ error: 'You have low balance, kindly make a deposit to your account by contacting Customer Support' });
//     }

//     // Fetch pending product details
//     db.query(
//       'SELECT * FROM user_products WHERE user_id = ? AND (status = ? OR status = ? OR status = ?)',
//       [user_id, 'pending', 'frozen', 'merged'],
//       (err, userProductResult) => {
//         if (err) {
//           console.error('Error fetching pending product:', err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         const userProduct = userProductResult.length > 0 ? userProductResult[0] : null;

//         if (!userProduct) {
//           return res.status(200).json({ message: 'No pending product found' });
//         }

//         const { product_id } = userProduct;

//         // Fetch product details
//         db.query(
//           'SELECT p.*, up.* FROM products p ' +
//           'LEFT JOIN user_products up ON p.product_id = up.product_id ' +
//           'WHERE up.user_id = ? AND p.product_id = ?',
//           [user_id, product_id],
//           (err, productResult) => {
//             if (err) {
//               console.error('Error fetching product details:', err);
//               return res.status(500).json({ error: 'Internal server error' });
//             }

//             const product = productResult[0];

//             if (!product) {
//               return res.status(404).json({ error: 'Product not found' });
//             }

//             // Fetch user's merge targets from user_merge_targets table
//             db.query('SELECT merge_target FROM user_merge_targets WHERE user_id = ? ORDER BY id ASC', [user_id], (err, mergeTargetsResult) => {
//               if (err) {
//                 console.error('Error fetching merge targets:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//               }

//               const mergeTargets = mergeTargetsResult.map((target) => target.merge_target);

//               // Check if data_completed is equal to the merge_target
//               if (user.data_completed === mergeTargets[0]) {
//                 // Update the status of the user_product to 'merge' if data_completed matches merge_target
//                 db.query('UPDATE user_products SET status = ? WHERE user_id = ? AND product_id = ?', ['merge', user_id, product_id], (err) => {
//                   if (err) {
//                     console.error('Error updating user_product status:', err);
//                     return res.status(500).json({ error: 'Internal server error' });
//                   }
//                   res.status(200).json({ message: 'Data marked for merging' });
//                 });
//               } else {
//                 // Calculate commission based on user's level, product price, and merge commission
//                 const commission = calculateCommission(user.level_id, product.product_price, product.merge_commission);

//                 // Fetch merged and frozen product details
//                 db.query(
//                   'SELECT up.*, p.*, l.* FROM user_products up ' +
//                   'JOIN products p ON up.product_id = p.product_id ' +
//                   'JOIN levels l ' +
//                   'WHERE up.user_id = ? AND  up.status IN (?, ?)',
//                   [user_id, 'merged', 'frozen'],
//                   (err, mergedResult) => {
//                     if (err) {
//                       console.error('Error fetching merged and frozen products:', err);
//                       return res.status(500).json({ error: 'Internal server error' });
//                     }

//                     // Initialize variables to store total merged price and commission
//                     let totalMergedPrice = 0;
//                     let totalMergedCommission = 0;

//                     // Iterate over the rows in mergedResult and calculate total price and commission
//                     mergedResult.forEach((item) => {
//                       if (item.status === 'merged') {
//                         totalMergedPrice += item.product_price;
//                         totalMergedCommission += calculateCommission(user.level_id, item.product_price, item.merge_commission);
//                       }
//                     });

//                     // Add the total merged price and commission to the updated balance and commission
//                     const updatedBalance = user.balance + product.product_price + commission + totalMergedPrice;
//                     const updatedCommission = user.commission + commission + totalMergedCommission;

//                     // Update the status of merged and frozen products to 'completed'
//                     db.query(
//                       'UPDATE user_products SET status = ? WHERE user_id = ? AND status IN (?, ?)',
//                       ['completed', user_id, 'frozen', 'merged'],
//                       (err) => {
//                         if (err) {
//                           console.error('Error updating merged and frozen product status:', err);
//                           return res.status(500).json({ error: 'Internal server error' });
//                         }

//                         // Update user's balance and commission in the database
//                         db.query('UPDATE users SET balance = ?, commission = ? WHERE id = ?', [updatedBalance, updatedCommission, user_id], (err) => {
//                           if (err) {
//                             console.error('Error updating user balance and commission:', err);
//                             return res.status(500).json({ error: 'Internal server error' });
//                           }
//                           // Update the status of the user_product to 'completed'
//                           db.query('UPDATE user_products SET status = ? WHERE user_id = ?', ['completed', user_id], (err) => {
//                             if (err) {
//                               console.error('Error updating user_product status:', err);
//                               return res.status(500).json({ error: 'Internal server error' });
//                             }

//                             res.status(200).json({ message: 'Data submitted successfully', product });
//                           });
//                         });
//                       }
//                     );
//                   }
//                 );
//               }
//             });
//           }
//         );
//       }
//     );
//   });
// };

// Schedule a task to run every day at midnight (00:00)
cron.schedule("0 0 * * *", () => {
  // Call the clearCommission function to clear the commission column
  clearCommission();
});
// Function to clear the commission column for all users
function clearCommission() {
  // Perform the database update to clear the commission column for all users
  const clearCommissionQuery = "UPDATE users SET commission = 0";
  db.query(clearCommissionQuery, (err) => {
    if (err) {
      console.error("Error clearing commission:", err);
    } else {
      // console.log('Commission cleared successfully for all users.');
    }
  });
}

// // Function to handle merging and deducting balance
// const handleMerge = (user_id, user, product, res) => {
//   // Query the database to find the merged product with a specific status
//   const findMergedProductSql = 'SELECT * FROM user_products WHERE user_id = ? AND status = "merged"';
//   db.query(findMergedProductSql, [user_id], async (err, mergedProductResult) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // Check if there is a merged product
//     if (mergedProductResult.length > 0) {
//       const mergedProductPrice = product.product_price;

//       // Check if the user has a sufficient balance to cover the merged product
//       if (user.balance < mergedProductPrice) {
//         return res.status(400).json({ error: 'Insufficient balance for merging products' });
//       }

//       // Deduct the price of the merged product from the user's balance
//       const updatedBalance = user.balance - mergedProductPrice;

//       // Update user's balance
//       const updateUserSql = 'UPDATE users SET balance = ? WHERE id = ?';
//       db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         // Update the status of the previous merged product to "frozen"
//         const updatePreviousMergedProductSql = 'UPDATE user_products SET status = "frozen" WHERE user_id = ? AND status = "completed"';
//         db.query(updatePreviousMergedProductSql, [user_id], async (err) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           res.status(200).json({
//             message: 'Data submitted successfully, and product merged',
//           });
//         });
//       });
//     } else {
//       // There is no merged product with the specified status
//       return res.status(400).json({ error: 'No merged product found' });
//     }
//   });
// };

// #### GET NOTIFICATIONS API CODE

// Function to get notifications by user ID
const get_notifications = (req, res) => {
  try {
    const userId = req.params.userId;

    const logged_in_user_id = req.user.userId;

    if (userId != logged_in_user_id) {
      return res.status(401).json({ error: "You are not authorized." });
    }

    // Query the database to retrieve notifications for the user
    const query = "SELECT * FROM notifications WHERE user_id = ?";
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching notifications." });
      }

      res.status(200).json({ notifications: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

//  ###### READ NOTIFICATIONS API

const mark_notification_as_read = (req, res) => {
  try {
    // Get the notification ID from the request body
    const { notificationId } = req.body;

    // console.log(notificationId)

    // Update the notification in your database to mark it as read
    const updateQuery = "UPDATE notifications SET is_read = 1 WHERE id = ?";
    db.query(updateQuery, [notificationId], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while marking the notification as read.",
        });
      } else {
        res
          .status(200)
          .json({ message: "Notification marked as read successfully." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

//  ####### GET ALL EVENTS API ##########

// API endpoint to get all events
const get_all_events = (req, res) => {
  try {
    // Define the SQL query to select all events
    const query = "SELECT * FROM events";

    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching events." });
      } else {
        res.status(200).json({ events: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

// ###### DRIVE DATA STATUS #####

const fetch_drive_data_status = (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const fetchUserSql = "SELECT * FROM users WHERE id = ?";
    db.query(fetchUserSql, [userId], async (err, userResult) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      const userDetails = userResult[0];

      if (!userDetails) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch user's level details
      const fetchLevelSql = "SELECT * FROM levels WHERE level_id = ?";
      db.query(
        fetchLevelSql,
        [userDetails.level_id],
        async (err, levelResult) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          }

          const userLevel = levelResult[0];

          if (!userLevel) {
            return res.status(404).json({ error: "User level not found" });
          }

          // Calculate drive_data based on user's data_completed and max_data_limit
          const driveData = `${userDetails.data_completed}/${userLevel.max_data_limit}`;

          res.status(200).json({ driveData });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ###### Get Contact support API

const get_customer_support = async (req, res) => {
  try {
    const sql = "SELECT * FROM customer_support";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};



// Automated request for reset user account






// A flag to track if the reset has already been performed today
let hasResetOccurred = false;

// reset task every day at 11:59 PM
cron.schedule('59 23 * * *', () => {
  if (!hasResetOccurred) {
    automated_request_for_reset_user_account();
    hasResetOccurred = true;
  }
});

// Function to reset user accounts
function automated_request_for_reset_user_account() {
  try {
    // Query users and their respective levels
    const resetAccountsSql = `
      SELECT u.id, u.level_id, u.data_completed, u.sets_completed_today, l.max_data_limit, l.max_sets_per_day
      FROM users u
      JOIN levels l ON u.level_id = l.level_id
    `;

    db.query(resetAccountsSql, (queryError, usersToReset) => {
      if (queryError) {
        console.error('Error querying users for reset: ' + queryError.message);
        return;
      }

      usersToReset.forEach((user) => {
        if (user.data_completed >= user.max_data_limit && user.sets_completed_today >= user.max_sets_per_day) {
          // Perform the user account reset here
          const resetAccountSql = 'UPDATE users SET sets_completed_today = 0, data_completed = 0, merge_count = 0, frozen_count = 0 WHERE id = ?';
          db.query(resetAccountSql, [user.id], (updateError) => {
            if (updateError) {
              // console.error('Error resetting user account: ' + updateError.message);
              // Handle the error, you can log it or take other actions as needed
            } else {
              // console.log(`User account reset for user ID: ${user.id}`);
            }
          });
        }
      });

      console.log('User accounts reset successfully');
      // Reset the flag after the reset has been completed
      hasResetOccurred = false;
    });
  } catch (error) {
    console.error('Error resetting user accounts: ' + error.message);
    // Handle the error, you can log it or take other actions as needed
  }
}






const test = (req, res) => {
  // console.log("test");
  // console.log(req.body);
  var reservation_data = req.body.data;
  var user_data_from_hqrentals;
  // console.log(req.body.data.flight_airline);
  // console.log(req.body.data.flight_number);
  // console.log(req.body.data.flight_departure_airline);
  // console.log(req.body.data.flight_departure_number);
  // console.log(reservation_data.customer_id);
  if (
    reservation_data.customer_id != null ||
    reservation_data.customer_id != "" ||
    reservation_data.customer_id != undefined
  ) {
    var options = {
      method: "GET",
      url: `https://api-america-3.us5.hqrentals.app/api-america-3/contacts/categories/3/contacts/${reservation_data.customer_id}`,
      headers: {
        Authorization:
          "Basic MlVNUGQwNW1BVDZkZWczZExUaERIR0tFTGs5YWVzNE80bXdQcFVNNzFPSjI4MkNlRWg6aHc5aXRzc2lzTEVJb2pVU2ZvMlRtYVEwVWUyeTJRT1RzRG9rcTh3RVZpSXBkSUxmSFQ=",
      },
      formData: {},
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      // console.log(response.body);
      user_data_from_hqrentals = JSON.parse(response.body);
      // console.log(user_data_from_hqrentals.contact);
      // user_data_from_hqrentals.contact.email

      var url =
        "https://rentsmartrac.myfreshworks.com/crm/sales/api/contacts/view/26001853820";
      headers = {
        Authorization: "Token token=VxIxI3hJkd6ar2oyBmMquw",
        "Content-Type": "application/json",
      };
      options = {
        url,
        method: "GET",
        headers,
      };
      request(options, (error, response, body) => {
        if (error) {
          console.error(`Error: ${error}`);
        } else {
          // console.log(body)
          var contact_data_from_freshworks = JSON.parse(body);
          // console.log();
          contact_data_from_freshworks.contacts.forEach((element) => {
            //
            if (element.email == user_data_from_hqrentals.contact.email) {
              url = `https://rentsmartrac.myfreshworks.com/crm/sales/api/contacts/${element.id}`;
              headers = {
                Authorization: "Token token=VxIxI3hJkd6ar2oyBmMquw",
                "Content-Type": "application/json",
              };
              requestData = {
                contact: {
                  first_name: req.body.data.first_name,
                  last_name: req.body.data.last_name,
                  display_name:
                    req.body.data.first_name + " " + req.body.data.last_name,
                  city: req.body.data.city,
                  state: req.body.data.state,
                  zipcode: req.body.data.zip,
                  country: req.body.data.country,
                  email: req.body.data.email,
                  mobile_number: req.body.data.phone_number,
                  address: req.body.data.street,
                  custom_field: {
                    // flight_departure_date

                    cf_flight_airline: req.body.data.flight_airline,
                    cf_flight_number: req.body.data.flight_number,
                    cf_departure_flight_airline:
                      req.body.data.flight_departure_airline,
                    cf_departure_flight_number:
                      req.body.data.flight_departure_number,
                    cf_pick_up_location: req.body.data.pick_up_location_label,
                    cf_drop_off_location: req.body.data.return_location_label,
                    cf_drop_off_time: req.body.data.return_time,
                    // cf_vehicle_class: req.body.data.,
                    // cf_terminal: req.body.data.,
                    cf_pick_up_date: req.body.data.pick_up_date,
                    cf_drop_off_date: req.body.data.return_date,
                    cf_pick_up_time: req.body.data.pick_up_time,
                    // cf_dl_number: req.body.data.,
                    // cf_dl_expiration_date: req.body.data.,
                  },
                },
              };
              options = {
                url,
                method: "PUT",
                headers,
                json: requestData, // Automatically sets the content-type to application/json
              };
              request(options, (error, response, body) => {
                if (error) {
                  console.error(`Error: ${error}`);
                } else {
                  console.log("data updated");
                  return res.status(200).json({ mgs: "Data Updated" });
                }
              });
            }
          });
        }
      });
    });
  }
  // pehla_data.customer_id;
  // {
  //   0|index  |   action: 'updated',
  //   0|index  |   item: 'App\\Modules\\CarRental\\Models\\Reservation',
  //   0|index  |   data: {
  //   0|index  |     id: 13207,
  //   0|index  |     prefixed_id: 'MIA - 13207',
  //   0|index  |     custom_reservation_number: null,
  //   0|index  |     pick_up_date: '2023-10-20T09:00:00.000000Z',
  //   0|index  |     initial_pick_up_date: '2023-10-20T09:00:00.000000Z',
  //   0|index  |     return_date: '2023-10-21T12:00:00.000000Z',
  //   0|index  |     initial_return_date: null,
  //   0|index  |     flight_arrival_date: '2023-10-20T09:00:00.000000Z',
  //   0|index  |     cancellation_date: null,
  //   0|index  |     cancellation_comments: null,
  //   0|index  |     cancellation_reason_id: null,
  //   0|index  |     cancelled_by: null,
  //   0|index  |     cancelled_at: null,
  //   0|index  |     brand_id: 1,
  //   0|index  |     initial_brand_id: 1,
  //   0|index  |     vehicle_class_id: 4,
  //   0|index  |     free_vehicle_class_upgrade_id: null,
  //   0|index  |     pick_up_location_id: 2,
  //   0|index  |     return_location_id: 2,
  //   0|index  |     flight_number: '',
  //   0|index  |     flight_airline: '',
  //   0|index  |     pick_up_location_custom: null,
  //   0|index  |     return_location_custom: '',
  //   0|index  |     local_address: null,
  //   0|index  |     customer_id: 31957,
  //   0|index  |     currency: 'usd',
  //   0|index  |     rack_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '57.60',
  //   0|index  |       usd_amount: '57.60',
  //   0|index  |       amount_for_display: '$57.60'
  //   0|index  |     },
  //   0|index  |     equipment_price: null,
  //   0|index  |     miscellaneous_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '4.31',
  //   0|index  |       usd_amount: '4.31',
  //   0|index  |       amount_for_display: '$4.31'
  //   0|index  |     },
  //   0|index  |     protections_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '73.30',
  //   0|index  |       usd_amount: '73.30',
  //   0|index  |       amount_for_display: '$73.30'
  //   0|index  |     },
  //   0|index  |     external_charges_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     discounts_amount: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '14.40',
  //   0|index  |       usd_amount: '14.40',
  //   0|index  |       amount_for_display: '$14.40'
  //   0|index  |     },
  //   0|index  |     taxes_amount: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '4.31',
  //   0|index  |       usd_amount: '4.31',
  //   0|index  |       amount_for_display: '$4.31'
  //   0|index  |     },
  //   0|index  |     security_deposit: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '500.00',
  //   0|index  |       usd_amount: '500.00',
  //   0|index  |       amount_for_display: '$500.00'
  //   0|index  |     },
  //   0|index  |     security_deposit_excess: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '2500.00',
  //   0|index  |       usd_amount: '2500.00',
  //   0|index  |       amount_for_display: '$2,500.00'
  //   0|index  |     },
  //   0|index  |     manual_discount: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     manual_discount_percentage: '0.00',
  //   0|index  |     manual_discount_is_percentage: 0,
  //   0|index  |     government_tax: '0.0000000',
  //   0|index  |     abb_tax: '7.0000000',
  //   0|index  |     location_fee: '0.0000000',
  //   0|index  |     outstanding_balance: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     status: 'pending',
  //   0|index  |     completed_at: null,
  //   0|index  |     completed_by: null,
  //   0|index  |     reopened_by: null,
  //   0|index  |     after_sale_email_sent: false,
  //   0|index  |     forced_security_deposit_id: null,
  //   0|index  |     reservation_from_website: false,
  //   0|index  |     created_by: 26298,
  //   0|index  |     updated_by: 26298,
  //   0|index  |     deleted_at: null,
  //   0|index  |     created_at: '2023-10-20T09:53:57.000000Z',
  //   0|index  |     updated_at: '2023-10-20T11:29:52.000000Z',
  //   0|index  |     uuid: 'ykxtzrcm-xmlj-vgn1-pa0t-2uj3kmwttf7u',
  //   0|index  |     uuid_short: 'K4WyijP0ihdD',
  //   0|index  |     no_show_fee: null,
  //   0|index  |     cancellation_fee: null,
  //   0|index  |     direct_booker_ip: null,
  //   0|index  |     country_code: null,
  //   0|index  |     region_code: null,
  //   0|index  |     zip_code: null,
  //   0|index  |     booker_information: null,
  //   0|index  |     percentage_discount_from_to_commission: null,
  //   0|index  |     was_reopened: false,
  //   0|index  |     has_package_reservation: false,
  //   0|index  |     primary_agent_id: null,
  //   0|index  |     secondary_agents: null,
  //   0|index  |     primary_return_agent_id: null,
  //   0|index  |     secondary_return_agents: null,
  //   0|index  |     walk_in_customer: false,
  //   0|index  |     security_deposit_automatically_charged: false,
  //   0|index  |     security_deposit_paid: false,
  //   0|index  |     exchange_rate_from_currency_to_base: '1.000000000000000000000000000000',
  //   0|index  |     digital_signature: null,
  //   0|index  |     reservation_commission: null,
  //   0|index  |     loan_reservation: null,
  //   0|index  |     distance_limit_per_day: 0,
  //   0|index  |     distance_limit_per_week: 0,
  //   0|index  |     distance_limit_per_month: 0,
  //   0|index  |     return_reminder_email_sent: false,
  //   0|index  |     last_day_counts_for_calculations: null,
  //   0|index  |     reservation_interval: null,
  //   0|index  |     digital_signature_for_initials: null,
  //   0|index  |     signed_at: null,
  //   0|index  |     initials_signed_at: null,
  //   0|index  |     base_reservation_commission: '0.0000000',
  //   0|index  |     commission_type: 'percentage',
  //   0|index  |     disable_renewal: false,
  //   0|index  |     renew_contract_x_days_in_advance: 0,
  //   0|index  |     security_deposit_refunded: false,
  //   0|index  |     referral: null,
  //   0|index  |     security_deposit_charged_amount: 0,
  //   0|index  |     security_deposit_refunded_amount: null,
  //   0|index  |     distance_manually_updated: 0,
  //   0|index  |     transaction_fees_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     distance_limit: 0,
  //   0|index  |     force_renewal_to_x_days: 0,
  //   0|index  |     reserved_from: '2023-10-20T09:53:57.000000Z',
  //   0|index  |     percentage_charges_over_discounted_rate: true,
  //   0|index  |     damages_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     charge_distance_when_limit_is_zero: false,
  //   0|index  |     dont_include_location_fee_in_tax_calculation: false,
  //   0|index  |     reservation_type: 'short',
  //   0|index  |     ota_reservation_type: null,
  //   0|index  |     ota_reservation_id: null,
  //   0|index  |     user_digital_signature_id: null,
  //   0|index  |     user_digital_signature_for_initials_id: null,
  //   0|index  |     car_sharing_vehicle_returned: 0,
  //   0|index  |     total_price: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '130.90',
  //   0|index  |       usd_amount: '130.90',
  //   0|index  |       amount_for_display: '$130.90'
  //   0|index  |     },
  //   0|index  |     authorization_transaction_id: null,
  //   0|index  |     reservation_started_at: 1697792400,
  //   0|index  |     reservation_ended_at: 1697889600,
  //   0|index  |     flight_departure_date: '2023-10-21T12:00:00.000000Z',
  //   0|index  |     flight_departure_number: '',
  //   0|index  |     flight_departure_airline: '',
  //   0|index  |     total_rack_rate: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '57.60',
  //   0|index  |       usd_amount: '57.60',
  //   0|index  |       amount_for_display: '$57.60'
  //   0|index  |     },
  //   0|index  |     total_insurances: 0,
  //   0|index  |     total_extras: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '69.30',
  //   0|index  |       usd_amount: '69.30',
  //   0|index  |       amount_for_display: '$69.30'
  //   0|index  |     },
  //   0|index  |     total_taxes: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '8.31',
  //   0|index  |       usd_amount: '8.31',
  //   0|index  |       amount_for_display: '$8.31'
  //   0|index  |     },
  //   0|index  |     total_revenue: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '126.90',
  //   0|index  |       usd_amount: '126.90',
  //   0|index  |       amount_for_display: '$126.90'
  //   0|index  |     },
  //   0|index  |     total_paid: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '135.21',
  //   0|index  |       usd_amount: '135.21',
  //   0|index  |       amount_for_display: '$135.21'
  //   0|index  |     },
  //   0|index  |     total_refunded: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     total_days: 1,
  //   0|index  |     rental_user_id: null,
  //   0|index  |     dont_include_vehicle_damages_in_location_fee: false,
  //   0|index  |     dont_include_vehicle_damages_in_taxes: false,
  //   0|index  |     synced_to_amazon_s3: 0,
  //   0|index  |     internal_reservation: false,
  //   0|index  |     total_location_fee: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '0.00',
  //   0|index  |       usd_amount: '0.00',
  //   0|index  |       amount_for_display: '$0.00'
  //   0|index  |     },
  //   0|index  |     total_abb_tax: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '4.31',
  //   0|index  |       usd_amount: '4.31',
  //   0|index  |       amount_for_display: '$4.31'
  //   0|index  |     },
  //   0|index  |     total_government_tax: null,
  //   0|index  |     include_external_charges_in_location_fee: true,
  //   0|index  |     include_external_charges_in_taxes: true,
  //   0|index  |     last_payment_request_sent_at: null,
  //   0|index  |     last_payment_at: '2023-10-20T00:00:00.000000Z',
  //   0|index  |     user_agent: null,
  //   0|index  |     security_deposit_was_manually_changed: null,
  //   0|index  |     security_deposit_excess_was_manually_changed: null,
  //   0|index  |     language: 'en',
  //   0|index  |     preferred_credit_card_id: null,
  //   0|index  |     external_charge_account_id: null,
  //   0|index  |     multiple_seasons_for_weekdays: 0,
  //   0|index  |     mandatory_charges_based_on_combinations_enabled: 1,
  //   0|index  |     website_internal_confirmation_email_sent: false,
  //   0|index  |     confirmation_email_sent: 1,
  //   0|index  |     round_amounts_to_two_decimals_on_calculations: 0,
  //   0|index  |     max_hours_before_daily_price: '3.00',
  //   0|index  |     max_hours_before_daily_price_additional_charges: '3.00',
  //   0|index  |     rate_type_id: 0,
  //   0|index  |     without_mandatory_charges: false,
  //   0|index  |     renew_contract_x_hours_after_planned_return_date: 0,
  //   0|index  |     extension_paid_until: '2023-10-21T12:00:00.000000Z',
  //   0|index  |     has_pending_extensions: false,
  //   0|index  |     grace_period_hours_for_picking_up_cars: '0.00',
  //   0|index  |     grace_period_hours_for_returning_cars: '1.00',
  //   0|index  |     no_show_by: null,
  //   0|index  |     no_show_at: null,
  //   0|index  |     check_value_pricing_on_daily_vs_weekly_rates: false,
  //   0|index  |     availability_percentage_at_creation: '10.0000',
  //   0|index  |     enable_multiple_seasons_bookings: 1,
  //   0|index  |     enable_season_rates_based_on_multipliers: 0,
  //   0|index  |     forced_close_reason: null,
  //   0|index  |     driver_validated: false,
  //   0|index  |     ready_for_pick_up: false,
  //   0|index  |     ready_for_pick_up_approval_user_id: null,
  //   0|index  |     ready_for_pick_up_at: null,
  //   0|index  |     f294: '[]',
  //   0|index  |     enable_self_service_test_mode: false,
  //   0|index  |     signature_metadata: null,
  //   0|index  |     initials_signature_metadata: null,
  //   0|index  |     enable_self_service: true,
  //   0|index  |     enable_auto_pick_up: false,
  //   0|index  |     enable_auto_return: false,
  //   0|index  |     reservation_email_template_name: null,
  //   0|index  |     f381: null,
  //   0|index  |     disable_all_emails: false,
  //   0|index  |     f393: null,
  //   0|index  |     pick_up_location_label: 'Miami International Airport',
  //   0|index  |     return_location_label: 'Miami International Airport',
  //   0|index  |     reservation_type_label: 'Short Term',
  //   0|index  |     brand_label: 'RS Miami',
  //   0|index  |     total_price_without_taxes: {
  //   0|index  |       currency: 'usd',
  //   0|index  |       currency_icon: '$',
  //   0|index  |       amount: '130.90',
  //   0|index  |       usd_amount: '130.90',
  //   0|index  |       amount_for_display: '$130.90'
  //   0|index  |     },
  //   0|index  |     pick_up_time: '5:00 AM',
  //   0|index  |     return_time: '8:00 AM',
  //   0|index  |     notes: ''
  //   0|index  |   }
  //   0|index  | }
  // return res.status(200).json({ msg: "done" });
  // https://api-america-2.caagcrm.com/api-america-2/
  // 2UMPd05mAT6deg3dLThDHGKELk9aes4O4mwPpUM71OJ282CeEh

  //update contact
  if (req.body.action == "updated") {
  }
  if (req.body.action == "test") {
  } else {
  }
  // eyJraWQiOiJjdXN0b20tb2F1dGgta2V5aWQiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmcmVzaGNoYXQiLCJzdWIiOiI1Y2UwY2UyNy03MDEwLTRjZjEtYmFmMS01NDY2OTNkNDZjMjUiLCJjbGllbnRJZCI6ImZjLTg5Y2U4OTI0LTE1ZGUtNGQ2OC05ZTA4LWI2Yzg5YmY3NzQyNSIsInNjb3BlIjoiYWdlbnQ6cmVhZCBhZ2VudDpjcmVhdGUgYWdlbnQ6dXBkYXRlIGFnZW50OmRlbGV0ZSBjb252ZXJzYXRpb246Y3JlYXRlIGNvbnZlcnNhdGlvbjpyZWFkIGNvbnZlcnNhdGlvbjp1cGRhdGUgbWVzc2FnZTpjcmVhdGUgbWVzc2FnZTpnZXQgYmlsbGluZzp1cGRhdGUgcmVwb3J0czpmZXRjaCByZXBvcnRzOmV4dHJhY3QgcmVwb3J0czpyZWFkIHJlcG9ydHM6ZXh0cmFjdDpyZWFkIGFjY291bnQ6cmVhZCBkYXNoYm9hcmQ6cmVhZCB1c2VyOnJlYWQgdXNlcjpjcmVhdGUgdXNlcjp1cGRhdGUgdXNlcjpkZWxldGUgb3V0Ym91bmRtZXNzYWdlOnNlbmQgb3V0Ym91bmRtZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6bWVzc2FnZTpzZW5kIG1lc3NhZ2luZy1jaGFubmVsczptZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6dGVtcGxhdGU6Y3JlYXRlIG1lc3NhZ2luZy1jaGFubmVsczp0ZW1wbGF0ZTpnZXQgZmlsdGVyaW5ib3g6cmVhZCBmaWx0ZXJpbmJveDpjb3VudDpyZWFkIHJvbGU6cmVhZCBpbWFnZTp1cGxvYWQiLCJpc3MiOiJmcmVzaGNoYXQiLCJ0eXAiOiJCZWFyZXIiLCJleHAiOjIwMDEyNDY1MDYsImlhdCI6MTY4NTYyNzMwNiwianRpIjoiM2MzNzA3NmYtYzc4My00ZTU3LWFhYjItYWU4ZTlmZjYxMWU3In0.4etd9AVNQxCigpKPPbKp-B0D387Y_BX4U0GnCvccU_c
};

const update_contact = (req, res) => {
  // console.log(req.body);
  const user_data_from_hqrentals = req.body.data;
  // console.log(user_data_from_hqrentals);
  // data: {
  //   0|-a  |     id: 35703,
  //   0|-a  |     label: 'Asif1 Ahmed Ali',
  //   0|-a  |     entity: 'person',
  //   0|-a  |     first_name: 'Asif1',
  //   0|-a  |     last_name: 'Ahmed Ali',
  //   0|-a  |     gender: null,
  //   0|-a  |     birthdate: '2000-05-09',
  //   0|-a  |     birthdate_day: '09',
  //   0|-a  |     birthdate_month: '05',
  //   0|-a  |     birthdate_year: '2000',
  //   0|-a  |     birthplace: null,
  //   0|-a  |     nationality: null,
  //   0|-a  |     street: 'H#599, St#45, B-17, Islamabad',
  //   0|-a  |     street2: null,
  //   0|-a  |     last_rental: null,
  //   0|-a  |     city: 'islamabad',
  //   0|-a  |     state: 'asdf',
  //   0|-a  |     zip: '44000',
  //   0|-a  |     county: null,
  //   0|-a  |     country: 'pk',
  //   0|-a  |     email: 'asif@mexil.it',
  //   0|-a  |     website: null,
  //   0|-a  |     phone_number: '03331871434',
  //   0|-a  |     uuid: 'piiprnxd-fnki-onmy-kafz-mu82hgs4gz2y',
  //   0|-a  |     created_by: 26298,
  //   0|-a  |     updated_by: 26298,
  //   0|-a  |     deleted_at: null,
  //   0|-a  |     created_at: '2023-11-10T01:57:15.000000Z',
  //   0|-a  |     updated_at: '2023-11-17T09:35:31.000000Z',
  //   0|-a  |     driver_license: null,
  //   0|-a  |     phone_alternative: null,
  //   0|-a  |     email_alternative: null,
  //   0|-a  |     housenumber: null,
  //   0|-a  |     suburb: null,
  //   0|-a  |     identification: null,
  //   0|-a  |     phone_cc: null,
  //   0|-a  |     phone_country: null,
  //   0|-a  |     accounting_list_id: null,
  //   0|-a  |     accounting_edit_sequence: null,
  //   0|-a  |     password: null,
  //   0|-a  |     reset_password_token: null,
  //   0|-a  |     expiration_date_for_password_reset_token: null,
  //   0|-a  |     phone_ext: null,
  //   0|-a  |     f193: null,
  //   0|-a  |     f194: null,
  //   0|-a  |     f195: null,
  //   0|-a  |     f196: null,
  //   0|-a  |     f198: null,
  //   0|-a  |     invoices_currency: '',
  //   0|-a  |     invoices_open_balance: null,
  //   0|-a  |     invoices_overdue_balance: null,
  //   0|-a  |     car_rental_reservation_count: 1,
  //   0|-a  |     external_contact_type: null,
  //   0|-a  |     external_contact_id: null,
  //   0|-a  |     car_rental_balance: null,
  //   0|-a  |     expiration_notification_sent: 0,
  //   0|-a  |     f252: null,
  //   0|-a  |     f254: null,
  //   0|-a  |     f256: null,
  //   0|-a  |     from_public_form: false,
  //   0|-a  |     verified: true,
  //   0|-a  |     language: 'en',
  //   0|-a  |     invoices_last_reminder_sent_at: null,
  //   0|-a  |     id_verification_id: null,
  //   0|-a  |     f298: 'Asif Ahmed Ali',
  //   0|-a  |     f299: null,
  //   0|-a  |     f300: null,
  //   0|-a  |     f301: null,
  //   0|-a  |     f309: '{"items":{"1":{"type":"mobile","number":"+923331871434","cc":"92","ext":"","id":"10058","country":"pk"}}}',
  //   0|-a  |     f354: null,
  //   0|-a  |     f356: null
  //   0|-a  |   }
  // cf_dl_number
  // cf_dl_expiration_date

  // driver_license:
  // f256:
  var url =
    "https://rentsmartrac.myfreshworks.com/crm/sales/api/contacts/view/26001853820";
  headers = {
    Authorization: "Token token=VxIxI3hJkd6ar2oyBmMquw",
    "Content-Type": "application/json",
  };
  options = {
    url,
    method: "GET",
    headers,
  };
  request(options, (error, response, body) => {
    if (error) {
      console.error(`Error: ${error}`);
    } else {
      // console.log(body)
      var contact_data_from_freshworks = JSON.parse(body);
      // console.log(contact_data_from_freshworks);
      contact_data_from_freshworks.contacts.forEach((element) => {
        //
        if (element.email == user_data_from_hqrentals.email) {
          url = `https://rentsmartrac.myfreshworks.com/crm/sales/api/contacts/${element.id}`;
          headers = {
            Authorization: "Token token=VxIxI3hJkd6ar2oyBmMquw",
            "Content-Type": "application/json",
          };
          requestData = {
            contact: {
              first_name: req.body.data.first_name,
              last_name: req.body.data.last_name,
              display_name:
                req.body.data.first_name + " " + req.body.data.last_name,
              city: req.body.data.city,
              state: req.body.data.state,
              zipcode: req.body.data.zip,
              country: req.body.data.country,
              email: req.body.data.email,
              mobile_number: req.body.data.phone_number,
              address: req.body.data.street,
              custom_field: {
                cf_dl_number: req.body.data.driver_license,
                cf_dl_expiration_date: req.body.data.f256,
              },
            },
          };
          options = {
            url,
            method: "PUT",
            headers,
            json: requestData, // Automatically sets the content-type to application/json
          };
          request(options, (error, response, body) => {
            if (error) {
              console.log(`Error: ${error}`);
            } else {
              console.log("data updated");
              return res.status(200).json({ mgs: "Data Updated" });
            }
          });
        }
      });
    }
  });
};

const create_contact = (req, res) => {
  // console.log(req.body);
  // data: {
  //   0|-a  |     verified: true,
  //   0|-a  |     entity: 'person',
  //   0|-a  |     first_name: 'Asif',
  //   0|-a  |     last_name: 'Ahmed Ali',
  //   0|-a  |     email: 'asif@mexil.it',
  //   0|-a  |     f309: '{"items":{"1":{"type":"mobile","number":"333 1871434","cc":"92","ext":"","id":"","country":"pk"}}}',
  //   0|-a  |     phone_number: '03331871434',
  //   0|-a  |     street: 'H#599, St#45, B-17, Islamabad',
  //   0|-a  |     street2: null,
  //   0|-a  |     city: 'islamabad',
  //   0|-a  |     state: 'aksbdf',
  //   0|-a  |     zip: '44000',
  //   0|-a  |     country: 'pk',
  //   0|-a  |     birthdate: '2023-11-09',
  //   0|-a  |     deleted_at: null,
  //   0|-a  |     updated_by: 26298,
  //   0|-a  |     label: 'Asif Ahmed Ali',
  //   0|-a  |     birthdate_day: '09',
  //   0|-a  |     birthdate_month: '11',
  //   0|-a  |     birthdate_year: '2023',
  //   0|-a  |     created_by: 26298,
  //   0|-a  |     language: 'en',
  //   0|-a  |     uuid: 'pjx8q0u3-t8o2-ajh9-hf2z-svnqspvaruxh',
  //   0|-a  |     updated_at: '2023-11-17T09:41:56.000000Z',
  //   0|-a  |     created_at: '2023-11-17T09:41:56.000000Z',
  //   0|-a  |     id: 36739
  //   0|-a  |   }
  const options = {
    url: "https://rentsmartrac.myfreshworks.com/crm/sales/api/contacts",
    method: "POST",
    headers: {
      Authorization: "Token token=VxIxI3hJkd6ar2oyBmMquw",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        first_name: req.body.data.first_name,
        last_name: req.body.data.last_name,
        display_name: req.body.data.first_name + " " + req.body.data.last_name,
        city: req.body.data.city,
        state: req.body.data.state,
        zipcode: req.body.data.zip,
        country: req.body.data.country,
        email: req.body.data.email,
        mobile_number: req.body.data.phone_number,
        address: req.body.data.street,
        custom_field: {
          cf_dl_number: req.body.data.driver_license,
          cf_dl_expiration_date: req.body.data.f256,
        },
      },
    }),
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.body);
      // var created_contact = JSON.parse(response);
      // console.log(created_contact.body);
      console.log("----------------");
      // console.log(body);
      console.log("Contact Created");
    }
  });
};

module.exports = {
  user_signup,
  user_login,
  user_logout,
  get_user_profile,
  edit_user_profile,
  change_login_password,
  change_withdraw_password,
  deposit_amount_request,
  fetch_deposit_history_by_user,
  withdraw_amount_request,
  get_withdraw_history_by_user,
  // update_user_level,
  create_contact,
  bind_wallet,
  get_wallet_by_user,
  // edit_wallet,
  drive_data,
  get_all_data,
  get_pending_data,
  get_completed_data,
  get_frozen_data,
    test,
  update_contact,
  get_transactions_by_status,
  submit_data,
  get_notifications,
  mark_notification_as_read,
  get_all_events,
  fetch_drive_data_status,
  get_customer_support,
  automated_request_for_reset_user_account
};
