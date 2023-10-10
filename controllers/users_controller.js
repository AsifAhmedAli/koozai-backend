const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../DB/db.js"); // Database connection
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const cron = require('node-cron');

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
  
      db.query(sqlCheckPhone, [phone], async (checkPhoneError, checkPhoneResult) => {
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
            const sqlValidateInvitationCode = `
              SELECT user_id FROM referral_codes WHERE code = ?
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
                  return res.status(400).json({ error: "Invalid invitation code" });
                }
  
                const userId = validateCodeResult[0].user_id;
  
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
                    return res.status(404).json({ error: "Bronze level not found" });
                  }
  
                  const bronzeLevelId = levelResult[0].level_id;
  
                  // Insert the new user with the assigned membership level
                  const sqlInsertUser = `
                    INSERT INTO users (username, phone, login_password, withdraw_password, gender, balance, terms_accepted, level_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                  `;
  
                  db.query(
                    sqlInsertUser,
                    [
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
                      const sqlInsertReferralCode = `
                        INSERT INTO referral_codes (code, user_id, referred_by)
                        VALUES (?, ?, ?)
                      `;
  
                      db.query(
                        sqlInsertReferralCode,
                        [referralCode, userInsertId, invitation_code],
                        (referralInsertError) => {
                          if (referralInsertError) {
                            console.error(referralInsertError);
                            return res.status(500).json({ error: "Signup failed" });
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
                                return res
                                  .status(500)
                                  .json({
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
      });
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
          return res
            .status(403)
            .json({
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
    res.clearCookie('user_token');

    // You can also send a response indicating successful logout if needed
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Logout failed' });
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
          return res
            .status(500)
            .json({
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
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Fetch the user's login password hash from the database
    const sqlSelectPassword = 'SELECT login_password FROM users WHERE id = ?';
    db.query(sqlSelectPassword, [userId], async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch password hash' });
      }

      const storedHash = results[0].login_password;

      // Verify the old password
      const passwordMatches = await bcrypt.compare(old_password, storedHash);
      if (!passwordMatches) {
        return res.status(401).json({ error: 'Incorrect old password' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // Update the password in the database
      const sqlUpdatePassword = 'UPDATE users SET login_password = ? WHERE id = ?';
      db.query(sqlUpdatePassword, [hashedNewPassword, userId], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to update Login password' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Login Password updated successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
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
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Fetch the user's login password hash from the database
    const sqlSelectPassword = 'SELECT withdraw_password FROM users WHERE id = ?';
    db.query(sqlSelectPassword, [userId], async (error, results) => {
      if (error) {
        // console.error(error);
        return res.status(500).json({ error: 'Failed to fetch password hash' });
      }

      const storedHash = results[0].withdraw_password;

      // Verify the old password
      const passwordMatches = await bcrypt.compare(old_password, storedHash);
      if (!passwordMatches) {
        return res.status(401).json({ error: 'Incorrect old password' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // Update the password in the database
      const sqlUpdatePassword = 'UPDATE users SET withdraw_password = ? WHERE id = ?';
      db.query(sqlUpdatePassword, [hashedNewPassword, userId], (error, results) => {
        if (error) {
          // console.error(error);
          return res.status(500).json({ error: 'Failed to update withdraw password' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Withdraw Password updated successfully' });
      });
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'An error occurred' });
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
    const dbQuery = 'SELECT * FROM customer_support';
    db.query(dbQuery, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching WhatsApp numbers.' });
      } else {
        const supportWhatsAppData = result.map(row => {
          return {
            name: row.name,
            status: row.status,
            whatsappLink: `https://api.whatsapp.com/send/?phone=${row.whatsapp_number}&text=${encodeURIComponent(depositMessage)}&type=phone_number&app_absent=0`,
          };
        });

        // Insert the deposit request into the deposit_requests table
        const depositRequest = {
          user_id: userId,
          amount: amount,
          status: 'pending', // Initial status of the request
          timestamp: new Date(), // You might want to adjust this based on your database setup
        };

        const insertQuery = 'INSERT INTO deposit_requests SET ?';
        db.query(insertQuery, depositRequest, (error, result) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while submitting the deposit request.' });
          } else {
            res.status(200).json({
              message: 'Deposit request submitted for approval. Please contact support and submit payment.',
              supportWhatsAppData: supportWhatsAppData,
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
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
    const query = 'SELECT * FROM deposit_history WHERE user_id = ?';
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
          const total_transactions = results.length
        res.status(200).json({total_transactions, depositHistory: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};





// POST endpoint to submit a withdrawal request


const withdraw_amount_request = (req, res) => {
  try {
    const userId = req.body.userId;
    const amount = req.body.amount || 0;
    const withdrawPassword = req.body.withdrawPassword; // Withdraw password provided by user

    // Fetch the stored hashed password, user level, and withdrawal information
    const getUserQuery = 'SELECT u.withdraw_password, u.data_completed, u.level_id, l.level_name, l.max_data_limit, l.withdrawal_limit, l.max_withdrawals_per_day FROM users u JOIN levels l ON u.level_id = l.level_id WHERE u.id = ?';
    db.query(getUserQuery, [userId], (passwordError, userResult) => {
      if (passwordError) {
        console.error(passwordError);
        res.status(500).json({ error: 'An error occurred while fetching user information.' });
      } else if (userResult.length === 0) {
        res.status(401).json({ error: 'User not found.' });
      } else {
        const user = userResult[0];
        const hashedPassword = user.withdraw_password;
        const dataCompleted = user.data_completed;
        const levelId = user.level_id;
        const levelName = user.level_name;
        const maxDataLimit = user.max_data_limit;
        const withdrawalLimit = user.withdrawal_limit;
        const maxWithdrawalsPerDay = user.max_withdrawals_per_day;

        // Compare the provided withdrawPassword with the hashedPassword
        bcrypt.compare(withdrawPassword, hashedPassword, (compareError, passwordMatch) => {
          if (compareError) {
            console.error(compareError);
            res.status(500).json({ error: 'An error occurred while comparing passwords.' });
          } else if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid withdraw password.' });
          } else if (dataCompleted < maxDataLimit) {
            res.status(403).json({ error: `The amount in your account can only be withdrawn after ${maxDataLimit} data of the current level (${levelName}) are completed.` });
          } else {
            // Implement logic for withdrawal limit and maximum withdrawals per day based on user's level
            // Check if the withdrawal amount exceeds the user's withdrawal limit (0 indicates no limit)
            if (withdrawalLimit !== 0 && amount > withdrawalLimit) {
              res.status(403).json({ error: `Withdrawal amount exceeds your limit of ${withdrawalLimit} USDT.` });
            } else {
              // Check if the user has reached the maximum number of daily withdrawals
              const today = new Date().toISOString().split('T')[0]; // Get the current date in ISO format
              const getUserWithdrawalsQuery = 'SELECT COUNT(*) AS dailyWithdrawalCount FROM withdraw_history WHERE user_id = ? AND date = ?';
              db.query(getUserWithdrawalsQuery, [userId, today], (withdrawalError, withdrawalResult) => {
                if (withdrawalError) {
                  console.error(withdrawalError);
                  res.status(500).json({ error: 'An error occurred while fetching withdrawal history.' });
                } else {
                  const dailyWithdrawalCount = withdrawalResult[0].dailyWithdrawalCount || 0;

                  // Check if the user has exceeded the maximum number of daily withdrawals
                  if (dailyWithdrawalCount >= maxWithdrawalsPerDay) {
                    res.status(403).json({ error: `You have reached the maximum daily withdrawal limit of ${maxWithdrawalsPerDay} transactions.` });
                  } else {
                    // Proceed with the withdrawal process
                    // Fetch WhatsApp numbers and names from the customer_support table
                    const dbQuery = 'SELECT * FROM customer_support';
                    db.query(dbQuery, (error, result) => {
                      if (error) {
                        console.error(error);
                        res.status(500).json({ error: 'An error occurred while fetching WhatsApp numbers.' });
                      } else {
                        const supportWhatsAppData = result.map(row => {
                          return {
                            name: row.name,
                            status: row.status,
                            whatsappLink: `https://api.whatsapp.com/send/?phone=${row.whatsapp_number}&type=phone_number&app_absent=0`,
                          };
                        });

                        // Insert the withdrawal request into the withdraw_requests table
                        const withdrawalRequest = {
                          user_id: userId,
                          amount: amount,
                          status: 'pending', // Initial status of the request
                          timestamp: new Date() // You might want to adjust this based on your database setup
                        };

                        const insertQuery = 'INSERT INTO withdraw_requests SET ?';
                        db.query(insertQuery, withdrawalRequest, (error, result) => {
                          if (error) {
                            console.error(error);
                            res.status(500).json({ error: 'An error occurred while submitting the withdrawal request.' });
                          } else {
                            // Update the user's daily withdrawal history
                            const insertWithdrawalHistoryQuery = 'INSERT INTO withdraw_history (user_id, amount, date) VALUES (?, ?, ?)';
                            db.query(insertWithdrawalHistoryQuery, [userId, amount, today], (historyError) => {
                              if (historyError) {
                                console.error(historyError);
                              }

                              res.status(200).json({
                                message: 'Withdrawal request submitted for approval.',
                                supportWhatsAppData: supportWhatsAppData,
                              });
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
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
  { name: 'Bronze', minBalance: 0, maxBalance: 1499.99 },
  { name: 'Silver', minBalance: 1500, maxBalance: 2999.99 },
  { name: 'Gold', minBalance: 3000, maxBalance: 4999.99 },
  { name: 'Diamond', minBalance: 5000 }
];

// Function to update user levels based on balance
const update_user_level = () => {
  membershipLevels.forEach(level => {
    const updateLevelsQuery = `
      UPDATE users
      SET level_id = (SELECT level_id FROM levels WHERE level_name = ?)
      WHERE balance >= ? AND (balance <= ? OR ? IS NULL)
        AND (level_id IS NULL OR level_id < (SELECT level_id FROM levels WHERE level_name = ?));
    `;

    db.query(updateLevelsQuery, [level.name, level.minBalance, level.maxBalance, level.maxBalance, level.name], (err, result) => {
      if (err) {
        // console.error('Error updating user levels:', err);
      } else {
        // console.log(`Users in ${level.name} level updated:`, result.affectedRows, 'users');
      }
    });
  });
};

// Schedule the cron job to run every minute (adjust the schedule as needed)
cron.schedule('* * * * *', update_user_level);










const bind_wallet = async (req, res) => {
  try {
    const { user_id, full_name, crypto_exchange_platform, usdt_trc20_address, phone } = req.body;

    const logged_in_user_id = req.user.userId;

    if (user_id != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You are not authorized." });
    }

    // Check if the user already has a bound wallet
    const existingWalletQuery = 'SELECT * FROM bind_wallet WHERE user_id = ?';
    db.query(existingWalletQuery, [user_id], (existingWalletError, existingWalletResult) => {
      if (existingWalletError) {
        console.error(existingWalletError);
        return res.status(500).json({ error: 'An error occurred while checking existing wallet.' });
      }

      if (existingWalletResult.length > 0) {
        return res.status(400).json({ error: 'A wallet is already bound to this user.' });
      }

      // Check if the user exists before binding the wallet
      const userQuery = 'SELECT * FROM users WHERE ID = ?';
      db.query(userQuery, [user_id], (userError, userResult) => {
        if (userError) {
          console.error(userError);
          return res.status(500).json({ error: 'An error occurred while checking the user.' });
        }

        if (userResult.length === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }

        // Insert wallet binding details into the bind_wallet table
        const bindWalletQuery = 'INSERT INTO bind_wallet (user_id, full_name, crypto_exchange_platform, usdt_trc20_address, phone) VALUES (?, ?, ?, ?, ?)';
        db.query(
          bindWalletQuery,
          [user_id, full_name, crypto_exchange_platform, usdt_trc20_address, phone],
          (bindError, bindResult) => {
            if (bindError) {
              console.error(bindError);
              res.status(500).json({ error: 'An error occurred while binding the wallet.' });
            } else {
              // Insert notification into the notifications table
              const notificationMessage = `Your wallet has been successfully bound.`;
              const insertNotificationQuery = 'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, ?)';
              db.query(
                insertNotificationQuery,
                [user_id, notificationMessage, 0], // 0 means the notification is not read
                (notificationError, notificationResult) => {
                  if (notificationError) {
                    console.error(notificationError);
                    res.status(500).json({ error: 'An error occurred while adding the notification.' });
                  } else {
                    res.status(200).json({ message: 'Wallet successfully bound!' });
                  }
                }
              );
            }
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};


// ###### GET WALLET BY USER API CODE ############


const get_wallet_by_user = async (req, res) => {
  try {
    const user_id = req.params.userId; 

    const logged_in_user_id = req.user.userId;

    if (user_id != logged_in_user_id) {
      return res
        .status(401)
        .json({ error: "You are not authorized." });
    }

    // Query the database to retrieve wallet information for the user
    const query = 'SELECT * FROM bind_wallet WHERE user_id = ?';
    db.query(query, [user_id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(200).json({ walletData: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};







// Drive Data


// const drive_data = async (req, res) => {
//   const { user_id } = req.body;
//   let totalLimit; // Define totalLimit here

//   try {
//     // Check if there are any pending statuses for the user's products
//     const checkStatusSql = 'SELECT COUNT(*) AS pending_count FROM user_products WHERE user_id = ? AND status = "pending"';
//     db.query(checkStatusSql, [user_id], async (err, statusResult) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const pendingCount = statusResult[0].pending_count;

//       if (pendingCount > 0) {
//         // At least one product has a "pending" status, return an error
//         return res.status(400).json({ error: 'Kindly submit the previous data before proceeding with the next data' });
//       }

//       // Check if the user has a merged product
//       const checkMergedProductSql = 'SELECT COUNT(*) AS merged_count FROM user_products WHERE user_id = ? AND status = "merged"';
//       db.query(checkMergedProductSql, [user_id], async (err, mergedResult) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         const mergedCount = mergedResult[0].merged_count;

//         if (mergedCount > 0) {
//           // User has a merged product, cannot drive new data
//           return res.status(400).json({ error: 'You have a merged product, kindly submit it first and then drive new data.' });
//         }

//         // Fetch user details
//         const fetchUserSql = 'SELECT * FROM users WHERE id = ?';
//         db.query(fetchUserSql, [user_id], async (err, userResult) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           const userDetails = userResult[0];

//           if (!userDetails) {
//             return res.status(404).json({ error: 'User not found' });
//           }

//           // Check if user's balance is sufficient
//           if (userDetails.balance < 50) {
//             return res.status(400).json({ error: 'Insufficient balance' });
//           }

//           // Check if the user has reached the maximum sets per day
//           if (userDetails.sets_completed_today >= 2) {
//             return res.status(400).json({ error: 'Maximum sets per day reached' });
//           }

//           // Fetch user's level details
//           const fetchLevelSql = 'SELECT * FROM levels WHERE level_id = ?';
//           db.query(fetchLevelSql, [userDetails.level_id], async (err, levelResult) => {
//             if (err) {
//               console.error(err);
//               return res.status(500).json({ error: 'Internal server error' });
//             }

//             const userLevel = levelResult[0];

//             if (!userLevel) {
//               return res.status(404).json({ error: 'User level not found' });
//             }

//             totalLimit = userLevel.max_data_limit;

//             // Check if user has reached their maximum data limit in the current set
//             if (userDetails.data_completed >= totalLimit) {
//               // Check if there's another set available
//               if (userDetails.sets_completed_today < 1) {
//                 // Start a new set
//                 // Update user's sets completed today count
//                 const updatedSetsCompletedToday = userDetails.sets_completed_today + 1;

//                 // Reset user's data completed count
//                 const updatedDataCompleted = 0;

//                 const startNewSetSql = 'UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?';
//                 db.query(
//                   startNewSetSql,
//                   [updatedDataCompleted, updatedSetsCompletedToday, user_id],
//                   async (err) => {
//                     if (err) {
//                       console.error(err);
//                       return res.status(500).json({ error: 'Internal server error' });
//                     }

//                     // Continue assigning products to the user in the new set
//                     continueAssigningProducts(user_id, userDetails, userLevel, totalLimit, res);
//                   }
//                 );
//               } else {
//                 // No more sets available for today
//                 return res.status(400).json({ error: `User has completed ${totalLimit} Rating, Please contact Customer Service to request a withdrawal and confirm the reset account for the day` });
//               }
//             } else {
//               // Continue assigning products to the user in the current set
//               continueAssigningProducts(user_id, userDetails, userLevel, totalLimit, res);
//             }
//           });
//         });
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const continueAssigningProducts = (user_id, userDetails, userLevel, totalLimit, res) => {
//   // const fetchProductsSql = `
//   //   SELECT * FROM products
//   //   WHERE product_id NOT IN (
//   //     SELECT product_id FROM user_products WHERE user_id = ?
//   //   ) AND product_price  ? 
//   //   ORDER BY RAND() LIMIT 1
//   // `;

// //   const fetchProductsSql = `
// //     SELECT * FROM products
// //     WHERE (product_price = ? OR product_price <= 0.7 * ?)
// //     AND product_id NOT IN (
// //       SELECT product_id FROM user_products WHERE user_id = ?
// //     )
// //     ORDER BY RAND() LIMIT 1
// // `;

//       // const fetchProductsSql = `
//       // SELECT * FROM products
//       // WHERE product_price >= 0.5 * ?
//       //   AND product_price <= 0.8 * ?
//       // ORDER BY RAND() LIMIT 1
      
//       // `;
//       const fetchProductsSql = `
//       SELECT * FROM products
//       WHERE product_price >= 0.5 * ?
//         AND product_price <= 0.8 * ?
//       ORDER BY RAND() LIMIT 1
//     `;
    



//   db.query(fetchProductsSql, [user_id, userDetails.balance,userDetails.balance], async (err, productsResult) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const selectedProduct = productsResult[0];

//     if (!selectedProduct) {
//       // No suitable products found, start from the beginning
//       db.query('DELETE FROM user_products WHERE user_id = NULL', [user_id], async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         continueAssigningProducts(user_id, userDetails, userLevel, totalLimit, res);
        
//       });
//     } else {
//       let commission = 0;
//       if (userLevel.level_id === 1) {
//         // Bronze Membership Commission Calculation
//         commission = selectedProduct.product_price * (userLevel.commission_per_data / 100);
//       } else if (userLevel.level_id >= 2 && userLevel.level_id <= 4) {
//         // Silver, Gold, and Diamond Membership Commission Calculation
//         commission = selectedProduct.product_price * (userLevel.commission_per_data / 100);

//         if (userLevel.merge_commission && userDetails.merged) {
//           commission += selectedProduct.product_price * (userLevel.merge_commission / 100);
//         }
//       }

//       // Deduct product price from user's balance
//       const updatedBalance = userDetails.balance - selectedProduct.product_price;

//       // Update user's balance
//       const updateUserSql = 'UPDATE users SET balance = ? WHERE id = ?';
//       db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         // Update user's data completed count
//         const updatedDataCompleted = userDetails.data_completed + 1;

//         // Check if the user's data_completed matches merge_target from user_merge_targets
//         const checkMergeTargetSql = 'SELECT merge_target FROM user_merge_targets WHERE user_id = ?';
//         db.query(checkMergeTargetSql, [user_id], async (err, mergeTargetResult) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//             // console.log(mergeTargetResult)
//           const mergeTarget = mergeTargetResult[0].merge_target;

//           if (updatedDataCompleted === mergeTarget) {
//             // The user has reached the merge target, handle the merge
//             handle_merge(user_id, selectedProduct.product_id, res,userLevel);

         
            
//           } else {
//             // Calculate the remaining limit based on user's data completed count and max data limit
//             const remainingLimit = userLevel.max_data_limit - updatedDataCompleted;

//             // Update sets_completed_today count if needed
//             const updatedSetsCompletedToday =
//               updatedDataCompleted >= userLevel.max_data_limit ? userDetails.sets_completed_today + 1 : userDetails.sets_completed_today;

//             // Assign the product to the user
//             const assignProductSql = 'INSERT INTO user_products (user_id, product_id) VALUES (?, ?)';
//             db.query(assignProductSql, [user_id, selectedProduct.product_id], async (err) => {
//               if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'Internal server error' });
//               }

//               // Calculate drive_data out of the total limit
//               const driveData = updatedDataCompleted;
//               const totalLimit = userLevel.max_data_limit;

//               // Update the user's data_completed count and sets_completed_today count in the database
//               const updateUserStatsSql = 'UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?';
//               db.query(
//                 updateUserStatsSql,
//                 [updatedDataCompleted, updatedSetsCompletedToday, user_id],
//                 async (err) => {
//                   if (err) {
//                     console.error(err);
//                     return res.status(500).json({ error: 'Internal server error' });
//                   }

//                   res.status(200).json({
//                     message: 'Product assigned successfully',
//                     selected_product: selectedProduct,
//                     drive_data: `${driveData}/${totalLimit}`,
//                     remaining_limit: remainingLimit,
//                     commission: commission,
//                   });
//                 }
//               );
//             });
//           }
//         });
//       });
//     }
//   });
// };



// const handle_merge = (user_id, product_id, res) => {
//   // Fetch the user's level details
//   const fetchLevelSql = 'SELECT * FROM levels WHERE level_id = (SELECT level_id FROM users WHERE id = ?)';
//   db.query(fetchLevelSql, [user_id], async (err, levelResult) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const userLevel = levelResult[0];
    

//     // Check if the user is eligible for merging
//     const checkEligibilitySql = 'SELECT merge_target, product_id FROM user_merge_targets WHERE user_id = ?';
//     db.query(checkEligibilitySql, [user_id], async (err, mergeTargetResult) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const mergeTarget = mergeTargetResult[0].merge_target;
//       const product_id = mergeTargetResult[0].product_id;

//       // Fetch the user's completed products count
//       const fetchCompletedProductsSql = 'SELECT COUNT(*) AS completed_count FROM user_products WHERE user_id = ? AND status = "completed"';
//       db.query(fetchCompletedProductsSql, [user_id], async (err, completedCountResult) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         const completedCount = completedCountResult[0].completed_count;

//         if (completedCount >= mergeTarget) {
//           // The user is eligible for merging

//           // Fetch the merged product details from the products table
//           const fetchMergedProductSql = 'SELECT * FROM products WHERE product_id = ?';
//           db.query(fetchMergedProductSql, [product_id], async (err, mergedProductResult) => {
//             if (err) {
//               console.error(err);
//               return res.status(500).json({ error: 'Internal server error' });
//             }

//             // Check if the merged product was found
//             if (mergedProductResult.length > 0) {
//               const mergedProduct = mergedProductResult[0];

//               // Calculate commission based on user's level commission
//               let userLevelCommission = 0;
//               if (userLevel.level_id === 1) {
//                 // Bronze Membership Commission Calculation
//                 userLevelCommission = mergedProduct.product_price * (userLevel.merge_commission / 100);
//               } else if (userLevel.level_id === 2) {
//                 // Silver, Gold, and Diamond Membership Commission Calculation
//                 userLevelCommission = mergedProduct.product_price * (userLevel.merge_commission / 100);
//               }

//               // Calculate merge commission
//               let mergeCommission = 0;
//               if (userLevel.merge_commission) {
//                 mergeCommission = mergedProduct.product_price * (userLevel.merge_commission / 100);
//               }

//               // Calculate total commission
//               const commission = userLevelCommission + mergeCommission;

//               // Find the latest completed product's ID
//               const findLatestCompletedProductSql = `
//                 SELECT id FROM user_products
//                 WHERE user_id = ? AND status = "completed"
//                 ORDER BY created_at DESC
//                 LIMIT 1
//               `;
//               db.query(findLatestCompletedProductSql, [user_id], async (err, latestCompletedProductResult) => {
//                 if (err) {
//                   console.error(err);
//                   return res.status(500).json({ error: 'Internal server error' });
//                 }

//                 // Check if the latest completed product ID was found
//                 if (latestCompletedProductResult.length > 0) {
//                   const latestCompletedProductId = latestCompletedProductResult[0].id;

//                   // Update the status of the latest completed product to "frozen"
//                   const updateLatestCompletedProductSql = 'UPDATE user_products SET status = "frozen" WHERE id = ?';
//                   db.query(updateLatestCompletedProductSql, [latestCompletedProductId], async (err) => {
//                     if (err) {
//                       console.error(err);
//                       return res.status(500).json({ error: 'Internal server error' });
//                     }

//                     // Assign the merged product to the user
//                     const assignMergedProductSql = 'INSERT INTO user_products (user_id, product_id, status) VALUES (?, ?, "merged")';
//                     db.query(assignMergedProductSql, [user_id, product_id], async (err) => {
//                       if (err) {
//                         console.error(err);
//                         return res.status(500).json({ error: 'Internal server error' });
//                       }

//                       // Handle any additional logic related to product merge here

//                       // Include all columns of the merged product and commission in the response
//                       res.status(200).json({
//                         message: 'Product merged and assigned successfully',
//                         merged_product: mergedProduct,
//                         commission: commission,
//                       });
//                     });
//                   });
//                 } else {
//                   // No latest completed product found
//                   return res.status(400).json({ error: 'No latest completed product found' });
//                 }
//               });
//             } else {
//               // The merged product was not found in the products table
//               return res.status(400).json({ error: 'Merged product not found' });
//             }
//           });
//         } else {
//           // The user is not eligible for merging yet
//           return res.status(400).json({ error: 'User is not eligible for merging yet' });
//         }
//       });
//     });
//   });
// };




const drive_data = async (req, res) => {
  const { user_id } = req.body;
  let totalLimit; 

  try {
    // Check if there are any pending statuses for the user's products
    const checkStatusSql = 'SELECT COUNT(*) AS pending_count FROM user_products WHERE user_id = ? AND status = "pending"';
    db.query(checkStatusSql, [user_id], async (err, statusResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const pendingCount = statusResult[0].pending_count;

      if (pendingCount > 0) {
        // At least one product has a "pending" status, return an error
        return res.status(400).json({ error: 'Kindly submit the previous data before proceeding with the next data' });
      }

      // Check if the user has a merged product
      const checkMergedProductSql = 'SELECT COUNT(*) AS merged_count FROM user_products WHERE user_id = ? AND status = "merged"';
      db.query(checkMergedProductSql, [user_id], async (err, mergedResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        const mergedCount = mergedResult[0].merged_count;

        // if (mergedCount > 0) {
        //   // User has a merged product, cannot drive new data
        //   return res.status(400).json({ error: 'You have a merged product, kindly submit it first and then drive new data.' });
        // }

        // Fetch user details
        const fetchUserSql = 'SELECT * FROM users WHERE id = ?';
        db.query(fetchUserSql, [user_id], async (err, userResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          const userDetails = userResult[0];

          if (!userDetails) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Check if user's balance is sufficient
          if (userDetails.balance < 50) {
            return res.status(400).json({ error: 'Insufficient balance' });
          }

          // Check if the user has reached the maximum sets per day
          if (userDetails.sets_completed_today >= 2) {
            return res.status(400).json({ error: 'Maximum sets per day reached' });
          }

          // Fetch user's level details
          const fetchLevelSql = 'SELECT * FROM levels WHERE level_id = ?';
          db.query(fetchLevelSql, [userDetails.level_id], async (err, levelResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            const userLevel = levelResult[0];

            if (!userLevel) {
              return res.status(404).json({ error: 'User level not found' });
            }

            totalLimit = userLevel.max_data_limit;

            // Check if user has reached their maximum data limit in the current set
            if (userDetails.data_completed >= totalLimit) {
              // Check if there's another set available
              if (userDetails.sets_completed_today < 1) {
                // Start a new set
                // Update user's sets completed today count
                const updatedSetsCompletedToday = userDetails.sets_completed_today + 1;

                // Reset user's data completed count
                const updatedDataCompleted = 0;

                const startNewSetSql = 'UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?';
                db.query(
                  startNewSetSql,
                  [updatedDataCompleted, updatedSetsCompletedToday, user_id],
                  async (err) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ error: 'Internal server error' });
                    }

                    // Continue assigning products to the user in the new set
                    assignData(user_id, userDetails, userLevel, totalLimit, res);
                  }
                );
              } else {
                // No more sets available for today
                return res.status(400).json({ error: `User has completed ${totalLimit} Rating, Please contact Customer Service to request a withdrawal and confirm the reset account for the day` });
              }
            } else {
              // Continue assigning products to the user in the current set
              assignData(user_id, userDetails, userLevel, totalLimit, res);
            }
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// const assignData = (user_id, userDetails, userLevel, totalLimit, res) => {
//     const fetchProductsSql = `
//   SELECT * FROM products
//   WHERE product_price <= ?
//     AND product_id NOT IN (
//       SELECT product_id FROM user_products WHERE user_id = ?
//     )
//   ORDER BY RAND() LIMIT 1
// `;


//   db.query(fetchProductsSql, [userDetails.balance, userDetails.balance], async (err, productsResult) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const selectedProduct = productsResult[0];

//     if (!selectedProduct) {
//       // No suitable products found, start from the beginning
//       db.query('DELETE FROM user_products WHERE user_id = NULL', [user_id], async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         assignData(user_id, userDetails, userLevel, totalLimit, res);
//       });
//     } else {
//       let commission = 0;
//       if (userLevel.level_id === 1) {
//         // Bronze Membership Commission Calculation
//         commission = selectedProduct.product_price * (userLevel.commission_per_data / 100);
//       } else if (userLevel.level_id >= 2 && userLevel.level_id <= 4) {
//         // Silver, Gold, and Diamond Membership Commission Calculation
//         commission = selectedProduct.product_price * (userLevel.commission_per_data / 100);

//         if (userLevel.merge_commission && userDetails.merged) {
//           commission += selectedProduct.product_price * (userLevel.merge_commission / 100);
//         }
//       }

//       // Calculate the remaining limit based on user's data completed count and max data limit
//       const remainingLimit = userLevel.max_data_limit - userDetails.data_completed;

//       // Update sets_completed_today count if needed
//       const updatedSetsCompletedToday =
//         userDetails.data_completed >= userLevel.max_data_limit ? userDetails.sets_completed_today + 1 : userDetails.sets_completed_today;

//         // console.log("selected product",selectedProduct)
//       // Assign the product to the user
//       const assignProductSql = 'INSERT INTO user_products (user_id, product_id) VALUES (?, ?)';
//       db.query(assignProductSql, [user_id, selectedProduct.product_id], async (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         // Calculate drive_data out of the total limit
//         const driveData = userDetails.data_completed;
//         const totalLimit = userLevel.max_data_limit;

//         // Check if the user has reached the merge target
//         const checkMergeTargetSql = 'SELECT merge_target FROM user_merge_targets WHERE user_id = ?';
//         db.query(checkMergeTargetSql, [user_id], async (err, mergeTargetResult) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           const mergeTarget = mergeTargetResult[0].merge_target;

//           if (userDetails.data_completed + 1 === mergeTarget) {
//             // The user has reached the merge target, handle the merge
//             handle_merge(user_id, selectedProduct.product_id, res, userLevel,commission);
//           } else {
            
//             // Deduct the price of the selected product from the user's balance
//             const updatedBalance = userDetails.balance - selectedProduct.product_price;

//             // Update user's balance
//             const updateUserSql = 'UPDATE users SET balance = ? WHERE id = ?';
//             db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
//               if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'Internal server error' });
//               }

//               // Update the user's data_completed count and sets_completed_today count in the database
//               const updateUserStatsSql = 'UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?';
//               db.query(
//                 updateUserStatsSql,
//                 [userDetails.data_completed + 1, updatedSetsCompletedToday, user_id],
//                 async (err) => {
//                   if (err) {
//                     console.error(err);
//                     return res.status(500).json({ error: 'Internal server error' });
//                   }

//                   res.status(200).json({
//                     message: 'Product assigned successfully',
//                     selected_product: selectedProduct,
//                     drive_data: `${driveData}/${totalLimit}`,
//                     remaining_limit: remainingLimit,
//                     commission: commission,
//                   });
//                 }
//               );
//             });
//           }
//         });
//       });
//     }
//   });
// };

const assignData = (user_id, userDetails, userLevel, totalLimit, res) => {
  // Check if the user has reached the merge target
  const checkMergeTargetSql = 'SELECT merge_target FROM user_merge_targets WHERE user_id = ?';
  db.query(checkMergeTargetSql, [user_id], async (err, mergeTargetResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const mergeTarget = mergeTargetResult[0] && mergeTargetResult[0].merge_target;

    if (userDetails.data_completed + 1 === mergeTarget) {
      // The user has reached the merge target, handle the merge
      handle_merge(user_id, null, res, userLevel, null);
    } else {
      // Continue with product assignment logic
      const fetchProductsSql = `
        SELECT * FROM products
        WHERE product_price <= ?
          AND product_id NOT IN (
            SELECT product_id FROM user_products WHERE user_id = ?
          )
        ORDER BY RAND() LIMIT 1
      `;

      db.query(fetchProductsSql, [userDetails.balance, userDetails.balance], async (err, productsResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        const selectedProduct = productsResult[0];

        if (!selectedProduct) {
          // No suitable products found, start from the beginning
          db.query('DELETE FROM user_products WHERE user_id = NULL', [user_id], async (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            assignData(user_id, userDetails, userLevel, totalLimit, res);
          });
        } else {
          let commission = 0;
          if (userLevel.level_id === 1) {
            // Bronze Membership Commission Calculation
            commission = selectedProduct.product_price * (userLevel.commission_per_data / 100);
          } else if (userLevel.level_id >= 2 && userLevel.level_id <= 4) {
            // Silver, Gold, and Diamond Membership Commission Calculation
            commission = selectedProduct.product_price * (userLevel.commission_per_data / 100);

            if (userLevel.merge_commission && userDetails.merged) {
              commission += selectedProduct.product_price * (userLevel.merge_commission / 100);
            }
          }

          // Calculate the remaining limit based on user's data completed count and max data limit
          const remainingLimit = userLevel.max_data_limit - userDetails.data_completed;

          // Update sets_completed_today count if needed
          const updatedSetsCompletedToday =
            userDetails.data_completed >= userLevel.max_data_limit ? userDetails.sets_completed_today + 1 : userDetails.sets_completed_today;

          if (selectedProduct) {
            // Assign the product to the user if a product is available
            const assignProductSql = 'INSERT INTO user_products (user_id, product_id) VALUES (?, ?)';
            db.query(assignProductSql, [user_id, selectedProduct.product_id], async (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
              }

              // Calculate drive_data out of the total limit
              const driveData = userDetails.data_completed;
              const totalLimit = userLevel.max_data_limit;

              // Deduct the price of the selected product from the user's balance
              const updatedBalance = userDetails.balance - selectedProduct.product_price;

              // Update user's balance
              const updateUserSql = 'UPDATE users SET balance = ? WHERE id = ?';
              db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: 'Internal server error' });
                }

                // Update the user's data_completed count and sets_completed_today count in the database
                const updateUserStatsSql = 'UPDATE users SET data_completed = ?, sets_completed_today = ? WHERE id = ?';
                db.query(
                  updateUserStatsSql,
                  [userDetails.data_completed + 1, updatedSetsCompletedToday, user_id],
                  async (err) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ error: 'Internal server error' });
                    }

                    res.status(200).json({
                      message: 'Product assigned successfully',
                      selected_product: selectedProduct,
                      drive_data: `${driveData}/${totalLimit}`,
                      remaining_limit: remainingLimit,
                      commission: commission,
                    });
                  }
                );
              });
            });
          }
        }
      });
    }
  });
};




const handle_merge = (user_id, product_id, res, userLevel,commission) => {
  // Fetch the user's details before proceeding
  const fetchUserSql = 'SELECT * FROM users WHERE id = ?';
  db.query(fetchUserSql, [user_id], async (err, userResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const userDetails = userResult[0];

    // Check if the user is eligible for merging
    const checkEligibilitySql = 'SELECT merge_target, product_id FROM user_merge_targets WHERE user_id = ?';
    db.query(checkEligibilitySql, [user_id], async (err, mergeTargetResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const mergeTarget = mergeTargetResult[0].merge_target;
      const product_id = mergeTargetResult[0].product_id;

      // Fetch the user's completed products count
      const fetchCompletedProductsSql = 'SELECT COUNT(*) AS completed_count FROM user_products WHERE user_id = ? AND status = "completed"';
      db.query(fetchCompletedProductsSql, [user_id], async (err, completedCountResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        const completedCount = completedCountResult[0].completed_count;

        if (completedCount >= mergeTarget) {
          // The user is eligible for merging

          // Fetch the merged product details from the products table
          const fetchMergedProductSql = 'SELECT * FROM products WHERE product_id = ?';
          db.query(fetchMergedProductSql, [product_id], async (err, mergedProductResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if the merged product was found
            if (mergedProductResult.length > 0) {
              const mergedProduct = mergedProductResult[0];

              // Calculate commission based on user's level commission
              let userLevelCommission = 0;
              if (userLevel.level_id === 1) {
                // Bronze Membership Commission Calculation
                userLevelCommission = mergedProduct.product_price * (userLevel.merge_commission / 100);
              } else if (userLevel.level_id === 2) {
                // Silver, Gold, and Diamond Membership Commission Calculation
                userLevelCommission = mergedProduct.product_price * (userLevel.merge_commission / 100);
              }

              // Calculate merge commission
              let mergeCommission = 0;
              if (userLevel.merge_commission) {
                mergeCommission = mergedProduct.product_price * (userLevel.merge_commission / 100);
              }

              // Calculate total commission
              const commission = userLevelCommission + mergeCommission;

              // Find the latest completed product's ID
              const findLatestCompletedProductSql = `
                SELECT id FROM user_products
                WHERE user_id = ? AND status = "completed"
                ORDER BY created_at DESC
                LIMIT 1
              `;
              db.query(findLatestCompletedProductSql, [user_id], async (err, latestCompletedProductResult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if the latest completed product ID was found
                if (latestCompletedProductResult.length > 0) {
                  const latestCompletedProductId = latestCompletedProductResult[0].id;

                  // Update the status of the latest completed product to "frozen"
                  const updateLatestCompletedProductSql = 'UPDATE user_products SET status = "frozen" WHERE id = ?';
                  db.query(updateLatestCompletedProductSql, [latestCompletedProductId], async (err) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ error: 'Internal server error' });
                    }

                    // Deduct the price of the frozen and merged products from the user's balance
                    const updatedBalance = userDetails.balance - mergedProduct.product_price;

                    // Update user's balance
                    const updateUserSql = 'UPDATE users SET balance = ? WHERE id = ?';
                    db.query(updateUserSql, [updatedBalance, user_id], async (err) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Internal server error' });
                      }

                      // Assign the merged product to the user
                      const assignMergedProductSql = 'INSERT INTO user_products (user_id, product_id, status) VALUES (?, ?, "merged")';
                      db.query(assignMergedProductSql, [user_id, product_id], async (err) => {
                        if (err) {
                          console.error(err);
                          return res.status(500).json({ error: 'Internal server error' });
                        }

                        // Handle any additional logic related to product merge here

                        // Include all columns of the merged product and commission in the response
                        res.status(200).json({
                          message: 'Product merged and assigned successfully',
                          merged_product: mergedProduct,
                          commission: commission,
                        });
                      });
                    });
                  });
                } else {
                  // No latest completed product found
                  return res.status(400).json({ error: 'No latest completed product found' });
                }
              });
            } else {
              // The merged product was not found in the products table
              return res.status(400).json({ error: 'Merged product not found' });
            }
          });
        } else {
          // The user is not eligible for merging yet
          return res.status(400).json({ error: 'User is not eligible for merging yet' });
        }
      });
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
      console.error('Error fetching all data:', err);
      return res.status(500).json({ error: 'Internal server error' });
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
        console.error('Error fetching pending data:', err);
        return res.status(500).json({ error: 'Internal server error' });
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
  
      res.status(200).json({dataWithCommissions});
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
        console.error('Error fetching pending data:', err);
        return res.status(500).json({ error: 'Internal server error' });
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
  
      res.status(200).json({dataWithCommissions});
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
        console.error('Error fetching pending data:', err);
        return res.status(500).json({ error: 'Internal server error' });
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
  
      res.status(200).json({dataWithCommissions});
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
        return res.status(500).json({ error: 'Internal server error' });
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
        } else if (levelId >= 2 && levelId <= 4) {
          // Silver, Gold, and Diamond Membership Commission Calculation
          if (result.status === "merged" && mergeCommission) {
            // Use merge commission if the product is merged
            commission = productPrice * (mergeCommission / 100);
          } else {
            // Use simple commission for other cases
            commission = productPrice * (commissionPerData / 100);
          }
        }
  
        // Add the calculated commission to the result
        result.commission = commission;
  
        return result;
      });
  
      res.status(200).json({ dataWithCommissions });
    });
  };
  
  
  

  // SUBMIT DATA API CODE



  const calculateCommission = (level_id, product_price, merge_commission) => {
    let commission = 0;
    if (level_id === 1) {
      // Bronze Membership Commission Calculation
      commission = product_price * 0.005; // 0.5% commission per data
    } else if (level_id === 2) {
      // Silver Membership Commission Calculation
      commission = product_price * 0.01; // 1.0% commission per data
      if (merge_commission) {
        commission += product_price * 0.03; // 3.0% commission for merge data
      }
    } else if (level_id === 3) {
      // Gold Membership Commission Calculation
      commission = product_price * 0.015; // 1.5% commission per data
      if (merge_commission) {
        commission += product_price * 0.045; // 4.5% commission for merge data
      }
    } else if (level_id === 4) {
      // Diamond Membership Commission Calculation
      commission = product_price * 0.02; // 2.0% commission per data
      if (merge_commission) {
        commission += product_price * 0.06; // 6.0% commission for merge data
      }
    }
  
    return commission;
  };
  
  


  const submit_data = (req, res) => {
    const { user_id, product_id } = req.body;
  
    // Fetch user details
    db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, userResult) => {
      if (err) {
        console.error('Error fetching user details:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      const user = userResult[0];
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the user has a merged product and balance is insufficient
      if (user.balance < 0) {
        return res.status(400).json({ error: 'You have low balance, kindly make a deposit to your account by contacting Customer Support' });
      }
  
      // Fetch pending product details
      db.query(
        `
        SELECT * FROM user_products WHERE user_id = ? AND status IN ('merged', 'frozen', 'pending')
        ORDER BY FIELD(status, 'merged', 'frozen', 'pending')
        LIMIT 1
        `,
        [user_id],
        (err, userProductResult) => {
          if (err) {
            console.error('Error fetching user products:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          const userProduct = userProductResult.length > 0 ? userProductResult[0] : null;
  
          if (!userProduct) {
            return res.status(200).json({ message: 'No pending product found' });
          }

          db.query(
            `
            SELECT up.*, p.*
            FROM user_products AS up
            JOIN products AS p ON up.product_id = p.product_id
            WHERE up.user_id = ? AND up.status = "frozen"
            `,
        [user_id],
        (err, frozenProductResult) => {
          if (err) {
            console.error('Error fetching user products:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          const frozenProduct = frozenProductResult.length > 0 ? frozenProductResult[0] : null;

          console.log( frozenProduct && frozenProduct)
          console.log( frozenProduct && frozenProduct.status)
          console.log( frozenProduct && frozenProduct.product_price)
          
  
          if (!frozenProductResult) {
            return res.status(200).json({ message: 'No frozen product found' });
          }
  
          const { product_id } = userProduct;
  
          // Fetch product details
          db.query('SELECT * FROM products WHERE product_id = ?', [product_id], (err, productResult) => {
            if (err) {
              console.error('Error fetching product details:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
  
            const product = productResult[0];
  
            if (!product) {
              return res.status(404).json({ error: 'Product not found' });
            }
  
            db.query('SELECT * FROM levels WHERE level_id = ?', [user.level_id], (err, levelResult) => {
              if (err) {
                console.error('Error fetching level:', err);
                return res.status(500).json({ error: 'Internal server error' });
              }
  
              const userLevel = levelResult[0];
  
              // Calculate commission based on user's level, product price, and commission per data
              let commission = 0;
              if (user.level_id === 1) {
                // Bronze Membership Commission Calculation
                commission = product.product_price * 0.005; // 0.5% commission per data
              } else if (user.level_id === 2) {
                // Silver Membership Commission Calculation
                commission = product.product_price * 0.01; // 1.0% commission per data
                if (userProduct.status === "merged" && userLevel.merge_commission) {
                  commission += product.product_price * 0.03; // 3.0% commission for merge data
                }
              } else if (user.level_id === 3) {
                // Gold Membership Commission Calculation
                commission = product.product_price * 0.015; // 1.5% commission per data
                if (userProduct.status === "merged" && userLevel.merge_commission) {
                  commission += product.product_price * 0.045; // 4.5% commission for merge data
                }
              } else if (user.level_id === 4) {
                // Diamond Membership Commission Calculation
                commission = product.product_price * 0.02; // 2.0% commission per data
                if (userProduct.status === "merged" && userLevel.merge_commission) {
                  commission = product.product_price * 0.06; // 6.0% commission for merge data
                }
              }

              // if ( frozenProduct && frozenProduct.status === "frozen" && userLevel.commission_per_data) {
              //   commission = frozenProduct.product_price * 0.06; // 6.0% commission for merge data
              // }
              
              
              let frozenProductPrice = 0
              let frozenProductcommission = 0

              if(frozenProduct && frozenProduct.status === "frozen"){
                db.query(
                  'DELETE FROM user_merge_targets WHERE id = (SELECT MIN(id) FROM user_merge_targets WHERE user_id = ? LIMIT 1)',
                  [user_id],
                  (err, result) => {
                    if (err) {
                      console.error('Error clearing merge_target:', err);
                      return res.status(500).json({ error: 'Internal server error' });
                    }
                  // Your success handling code here
                });
                
                frozenProductPrice = frozenProduct.product_price
                frozenProductcommission = frozenProduct.product_price * 0.02; // 2.0% commission for merge data
                // frozenProductcommission = commission
                
              }

              // console.log("frozen commission", frozenProductcommission)
               
              // Update user's balance and commission for the current product
              let updatedBalance =  user.balance + product.product_price + frozenProductPrice +  frozenProductcommission + commission;
              let updatedCommission = user.commission + commission + frozenProductcommission;
  
              // Update the status of frozen products to 'completed'
              db.query(
                'UPDATE user_products SET status = ? WHERE user_id = ? AND status = ?',
                ['completed', user_id, 'frozen'],
                (err) => {
                  if (err) {
                    console.error('Error updating frozen product status:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                  }

                  // Update user's balance and commission in the database
                  db.query('UPDATE users SET balance = ?, commission = ? WHERE id = ?', [updatedBalance, updatedCommission, user_id], (err) => {
                    if (err) {
                      console.error('Error updating user balance and commission:', err);
                      return res.status(500).json({ error: 'Internal server error' });
                    }
  
                    // Update the status of the user_product to 'completed'
                    db.query('UPDATE user_products SET status = ? WHERE user_id = ?', ['completed', user_id], (err) => {
                      if (err) {
                        console.error('Error updating user_product status:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                      }

                     
  
                      res.status(200).json({ message: 'Data submitted successfully' });
                    
                    });
                  });
                }
              );
            });
            });
          });
        }
      );
    });
  };
  
  
  
  



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
cron.schedule('0 0 * * *', () => {
  // Call the clearCommission function to clear the commission column
  clearCommission();
});
// Function to clear the commission column for all users
function clearCommission() {
  // Perform the database update to clear the commission column for all users
  const clearCommissionQuery = 'UPDATE users SET commission = 0';
  db.query(clearCommissionQuery, (err) => {
    if (err) {
      console.error('Error clearing commission:', err);
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
        return res
          .status(401)
          .json({ error: "You are not authorized." });
      }
  

      // Query the database to retrieve notifications for the user
      const query = 'SELECT * FROM notifications WHERE user_id = ?';
      db.query(query, [userId], (error, results) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ error: 'An error occurred while fetching notifications.' });
          }

          res.status(200).json({ notifications: results });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
  }
};


//  ###### READ NOTIFICATIONS API 

const mark_notification_as_read = (req, res) => {
    try {
        // Get the notification ID from the request body
        const { notificationId } = req.body;

        // console.log(notificationId)

        // Update the notification in your database to mark it as read
        const updateQuery = 'UPDATE notifications SET is_read = 1 WHERE id = ?';
        db.query(updateQuery, [notificationId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while marking the notification as read.' });
            } else {
                res.status(200).json({ message: 'Notification marked as read successfully.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
};


//  ####### GET ALL EVENTS API ##########



// API endpoint to get all events
const get_all_events = (req, res) => {
  try {
    // Define the SQL query to select all events
    const query = 'SELECT * FROM events';

    // Execute the query
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching events.' });
      } else {
        res.status(200).json({ events: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};




  // ###### DRIVE DATA STATUS #####

  const fetch_drive_data_status = (req, res) => {
    try {
      const { userId } = req.params;
  
   
  
      // Fetch user details
      const fetchUserSql = 'SELECT * FROM users WHERE id = ?';
      db.query(fetchUserSql, [userId], async (err, userResult) => {
        if (err) {
      
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        const userDetails = userResult[0];
  
       
  
        if (!userDetails) {
          
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Fetch user's level details
        const fetchLevelSql = 'SELECT * FROM levels WHERE level_id = ?';
        db.query(fetchLevelSql, [userDetails.level_id], async (err, levelResult) => {
          if (err) {
          
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          const userLevel = levelResult[0];
  
         
  
          if (!userLevel) {
            return res.status(404).json({ error: 'User level not found' });
          }
  
          // Calculate drive_data based on user's data_completed and max_data_limit
          const driveData = `${userDetails.data_completed}/${userLevel.max_data_limit}`;
  
          res.status(200).json({ driveData });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  


  // ###### WITHDRAW AMOUNT REQUEST API CODE


  
  
  
  

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
  update_user_level,
  bind_wallet,
  get_wallet_by_user,
  // edit_wallet,
  drive_data,
  get_all_data,
  get_pending_data,
  get_completed_data,
  get_frozen_data,
  get_transactions_by_status,
  submit_data,
  get_notifications,
  mark_notification_as_read,
  get_all_events,
  fetch_drive_data_status,
  
};
