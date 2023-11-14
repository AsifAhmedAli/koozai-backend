const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../DB/db.js"); // Database connection
const cloudinary = require("cloudinary").v2;




// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  


// ######## Admin's LOGIN API code ######### //

// const admin_login = async (req, res) => {
//     try {
//       const { username, password } = req.body;
  
//       // Check if the admin exists
//       const sqlCheckAdmin = `
//         SELECT * FROM users WHERE username = ? AND role = 'admin'
//       `;
  
//       db.query(
//         sqlCheckAdmin,
//         [username],
//         async (checkAdminError, checkAdminReaddlt) => {
//           if (checkAdminError) {
//             console.error(checkAdminError);
//             return res.status(500).json({ error: "Login failed" });
//           }
  
//           if (checkAdminResult.length === 0) {
//             return res
//               .status(400)
//               .json({ error: "Username or password is incorrect" });
//           }
  
        
  
//           // Verify the password
//           const isPasswordValid = await bcrypt.compare(
//             password,
//             admin.login_password
//           );
  
//           if (!isPasswordValid) {
//             return res
//               .status(400)
//               .json({ error: "Username or password is incorrect" });
//           }
  
//           // Create and sign a JWT token
//           const token = jwt.sign(
//             { adminId: admin.id, username: admin.username, adminrole: admin.role },
//             process.env.JWT_SECRET,
//             {
//               expiresIn: "2d",
//             }
//           );
  
//           // Set the JWT token as a cookie
//           res.cookie("admin_token", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }); // 2 days in milliseconds
  
//           // Removing sensitive data
//           delete admin.login_password;
  
//           res.status(200).json({ message: "Admin login successful", admin, token });
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Admin login failed" });
//     }
//   };



// ######## Admin's LOGIN API code ######### //

// const admin_login = (req, res) => {
//     try {
//       const { username, password } = req.body;
  
//       // Check if the admin exists
//       const sqlCheckAdmin = `
//         SELECT * FROM users WHERE username = ? OR phone = ? AND role = 'admin'
//       `;
  
//       db.query(sqlCheckAdmin, [username], (checkAdminError, checkAdminResult) => {
//         if (checkAdminError) {
//           console.error(checkAdminError);
//           return res.status(500).json({ error: "Login failed" });
//         }
  
//         if (checkAdminResult.length === 0) {
//           return res
//             .status(400)
//             .json({ error: "Username or password is incorrect" });
//         }
  
//         const admin = checkAdminResult[0];
  
//         if (admin.login_password !== password) {
//           return res
//             .status(400)
//             .json({ error: "Username or password is incorrect" });
//         }
  
//         // Create and sign a JWT token
//         const token = jwt.sign(
//           { adminId: admin.id, username: admin.username, adminrole: admin.role },
//           process.env.JWT_SECRET_ADMIN,
//           {
//             expiresIn: "2d",
//           }
//         );
  
//         // Set the JWT token as a cookie
//         res.cookie("admin_token", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }); // 2 days in milliseconds
  
//         // Removing sensitive data
//         delete admin.login_password;
  
//         res.status(200).json({ message: "Admin login successful", admin, token });
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Admin login failed" });
//     }
//   };
  


const admin_login = (req, res) => {
    try {
      const { identifier, password } = req.body;
  
      // Check if the admin exists
      const sqlCheckAdmin = `
        SELECT * FROM users WHERE (username = ? OR phone = ?) AND role = 'admin'
      `;
  
      db.query(sqlCheckAdmin, [identifier, identifier], (checkAdminError, checkAdminResult) => {
        if (checkAdminError) {
          console.error(checkAdminError);
          return res.status(500).json({ error: "Login failed" });
        }
  
        if (checkAdminResult.length === 0) {
          return res
            .status(400)
            .json({ error: "Username or phone or password is incorrect" });
        }
  
        const admin = checkAdminResult[0];
  
        if (admin.login_password !== password) {
          return res
            .status(400)
            .json({ error: "Username or phone or password is incorrect" });
        }
  
        // Create and sign a JWT token
        const token = jwt.sign(
          { adminId: admin.id, username: admin.username, adminrole: admin.role },
          process.env.JWT_SECRET_ADMIN,
          {
            expiresIn: "2d",
          }
        );
  
        // Set the JWT token as a cookie
        res.cookie("admin_token", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }); // 2 days in milliseconds
  
        // Removing sensitive data
        delete admin.login_password;
  
        res.status(200).json({ message: "Admin login successful", admin, token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Admin login failed" });
    }
  };
  
  
  
  
  

// ######## Admin's GET Deposit Requests API code ######### //



const get_deposit_requests = (req, res) => {
    try {
      const logged_in_user = req.user;

      // Check if the logged-in user is an admin (you should have a way to determine this)
      if (logged_in_user.adminrole != 'admin') {
        return res.status(401).json({ error: 'You are not authorized to access this endpoint.' });
      }
  
      // Query the database to retrieve deposit requests
      // const query = 'SELECT * FROM deposit_requests';
      const query = 'SELECT deposit_requests.*, users.id as user_id,users.username,users.balance FROM deposit_requests INNER JOIN users ON deposit_requests.user_id = users.id ORDER BY deposit_requests.timestamp DESC';
      db.query(query, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred' });
        } else {
          
            const total_requests = results.length
          res.status(200).json({total_requests, depositRequests: results });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  



// ######## Admin's GET Single Deposit Request API code ######### //



const get_single_deposit_request = (req, res) => {
    try {
      const requestId = req.params.requestId;
  
      // Query the database to retrieve the specified deposit request
      const query = 'SELECT * FROM deposit_requests WHERE id = ?';
      db.query(query, [requestId], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred' });
        } else {
          if (results.length === 0) {
            res.status(404).json({ error: 'Deposit request not found.' });
          } else {
            res.status(200).json({ depositRequest: results[0] });
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  


// // ######## Admin's GET Single Deposit Request API code ######### //
  

// const approve_deposit_request = (req, res) => {
//     try {
//       const logged_in_user = req.user;
//       const requestId = req.params.requestId;
      
//       // Check if the logged-in user is an admin
//       if (logged_in_user.adminrole !== 'admin') {
//         return res.status(401).json({ error: 'You are not authorized to approve deposit requests.' });
//       }
    
//       // Update the status of the deposit request to 'approved'
//       const updateQuery = 'UPDATE deposit_requests SET status = ? WHERE id = ?';
//       db.query(updateQuery, ['approved', requestId], (error, result) => {
//         if (error) {
//           console.error(error);
//           res.status(500).json({ error: 'An error occurred while approving the deposit request.' });
//         } else if (result.affectedRows === 0) {
//           // If no rows were affected, the deposit request with the given requestId was not found
//           res.status(404).json({ error: 'Deposit request not found.' });
//         } else {
//           res.status(200).json({ message: 'Deposit request approved successfully.' });
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   };
  
  


// // ######## COMPLETED THE DEPOSIT REQUEST API CODE ######### //


const complete_deposit_request = (req, res) => {
    try {
      const requestId = req.params.requestId;
      const depositedAmount = req.body.depositedAmount; 

       // Check if depositedAmount is <= 0
       if (depositedAmount <= 0) {
        return res.status(400).json({ error: 'Please Enter a valid Amount to Deposit.' });
      }
      
      // Check if the deposit request status is already completed
      const checkStatusQuery = 'SELECT status FROM deposit_requests WHERE id = ?';
      db.query(checkStatusQuery, [requestId], (checkStatusError, checkStatusResult) => {
        if (checkStatusError) {
          console.error(checkStatusError);
          res.status(500).json({ error: 'An error occurred while checking deposit request status.' });
        } else if (checkStatusResult.length === 0) {
          res.status(404).json({ error: 'Deposit request not found.' });
        } else {
          const currentStatus = checkStatusResult[0].status;
          if (currentStatus === 'completed') {
            res.status(400).json({ error: 'This deposit request is already approved and completed.' });
          }
           else {
            // Update the status of the deposit request to 'completed'
            const updateQuery = 'UPDATE deposit_requests SET status = ?, amount = ? WHERE id = ?';
            db.query(updateQuery, ['completed', depositedAmount, requestId], (updateError, updateResult) => {
              if (updateError) {
                console.error(updateError);
                res.status(500).json({ error: 'An error occurred while updating deposit status and amount.' });
              } else if (updateResult.affectedRows === 0) {
                res.status(404).json({ error: 'Deposit request not found.' });
              } else {
                // Add to deposit history
                const userIdQuery = 'SELECT user_id FROM deposit_requests WHERE id = ?';
                db.query(userIdQuery, [requestId], (userIdError, userIdResult) => {
                  if (userIdError) {
                    console.error(userIdError);
                    res.status(500).json({ error: 'An error occurred while retrieving user ID.' });
                  } else {
                    const userId = userIdResult[0].user_id;
                    const depositHistoryQuery = 'INSERT INTO deposit_history (user_id, amount, timestamp) VALUES (?, ?, ?)';
                    const timestamp = new Date();
                    db.query(depositHistoryQuery, [userId, depositedAmount, timestamp], (historyError) => {
                      if (historyError) {
                        console.error(historyError);
                        res.status(500).json({ error: 'An error occurred while adding deposit history.' });
                      } else {
                        // Update user balance
                        const getUserBalanceQuery = 'SELECT balance FROM users WHERE id = ?';
                        db.query(getUserBalanceQuery, [userId], (balanceError, balanceResult) => {
                          if (balanceError) {
                            console.error(balanceError);
                            res.status(500).json({ error: 'An error occurred while retrieving user balance.' });
                          } else {
                            const currentBalance = balanceResult[0].balance;
                            const updatedBalance = currentBalance + depositedAmount;
                            const updateBalanceQuery = 'UPDATE users SET balance = ? WHERE id = ?';
                            db.query(updateBalanceQuery, [updatedBalance, userId], (updateBalanceError) => {
                              if (updateBalanceError) {
                                console.error(updateBalanceError);
                                res.status(500).json({ error: 'An error occurred while updating user balance.' });
                              } else {
                                // Add notification to the notifications table
                                const notificationMessage = `You have successfully recharged ${depositedAmount}USDT to your account `;

                                const addNotificationQuery = 'INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, ?, ?)';
                                db.query(addNotificationQuery, [userId, notificationMessage, 0, timestamp], (notificationError) => {
                                  if (notificationError) {
                                    console.error(notificationError);
                                    res.status(500).json({ error: 'An error occurred while adding notification.' });
                                  } else {
                                    res.status(200).json({
                                      message: 'Request completed Successfully',
                                      updatedBalance
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };


//  #### REJECT DEPOSIT REQUEST######
const reject_deposit_request = (req, res) => {
  try {
    const requestId = req.params.requestId;

    // Check if the deposit request status is already completed
    const checkStatusQuery = 'SELECT status FROM deposit_requests WHERE id = ?';
    db.query(checkStatusQuery, [requestId], (checkStatusError, checkStatusResult) => {
      if (checkStatusError) {
        console.error(checkStatusError);
        res.status(500).json({ error: 'An error occurred while checking deposit request status.' });
      } else if (checkStatusResult.length === 0) {
        res.status(404).json({ error: 'Deposit request not found.' });
      } else {
        const currentStatus = checkStatusResult[0].status;
        if (currentStatus === 'completed') {
          res.status(400).json({ error: 'This deposit request is already approved and completed.' });
        } else if (currentStatus === 'rejected') {
          res.status(400).json({ error: 'This deposit request is already rejected.' });
        } else {
          // Update the status of the deposit request to 'rejected'
          const updateQuery = 'UPDATE deposit_requests SET status = ? WHERE id = ?';
          db.query(updateQuery, ['rejected', requestId], (updateError, updateResult) => {
            if (updateError) {
              console.error(updateError);
              res.status(500).json({ error: 'An error occurred while updating deposit status.' });
            } else if (updateResult.affectedRows === 0) {
              res.status(404).json({ error: 'Deposit request not found.' });
            } else {
              // Add notification to the notifications table
              const userIdQuery = 'SELECT user_id FROM deposit_requests WHERE id = ?';
              db.query(userIdQuery, [requestId], (userIdError, userIdResult) => {
                if (userIdError) {
                  console.error(userIdError);
                  res.status(500).json({ error: 'An error occurred while retrieving user ID.' });
                } else {
                  const userId = userIdResult[0].user_id;
                  const timestamp = new Date();
                  const notificationMessage = `Your deposit request has been rejected.`;

                  const addNotificationQuery = 'INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, ?, ?)';
                  db.query(addNotificationQuery, [userId, notificationMessage, 0, timestamp], (notificationError) => {
                    if (notificationError) {
                      console.error(notificationError);
                      res.status(500).json({ error: 'An error occurred while adding notification.' });
                    } else {
                      res.status(200).json({
                        message: 'Deposit request rejected successfully'
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

  
  
  

  // ##### DIRECT DEPOSIT TO USER ACCOUNT WITHOUT ANY REQUEST 



  
    const deposit_direct = (req, res) => {
      try {
        const userId = req.body.userId;
        const amount = req.body.amount || 0;
    
        // Check if the deposited amount is 0 or negative
        if (amount <= 0) {
          return res.status(400).json({ error: 'Please enter a valid amount to deposit.' });
        }
    
        // Update the user's balance
        const updateBalanceQuery = 'UPDATE users SET balance = balance + ? WHERE id = ?';
        db.query(updateBalanceQuery, [amount, userId], (updateBalanceError, updateBalanceResult) => {
          if (updateBalanceError) {
            console.error(updateBalanceError);
            res.status(500).json({ error: 'An error occurred while updating user balance.' });
          } else {
            // Get the updated balance
            const getUserBalanceQuery = 'SELECT balance FROM users WHERE id = ?';
            db.query(getUserBalanceQuery, [userId], (balanceError, balanceResult) => {
              if (balanceError) {
                console.error(balanceError);
                res.status(500).json({ error: 'An error occurred while retrieving user balance.' });
              } else {
                const updatedBalance = balanceResult[0].balance;
    
                // Add deposit to history
                const timestamp = new Date();
                const depositHistoryQuery = 'INSERT INTO deposit_history (user_id, amount, timestamp) VALUES (?, ?, ?)';
                db.query(depositHistoryQuery, [userId, amount, timestamp], (historyError) => {
                  if (historyError) {
                    console.error(historyError);
                    res.status(500).json({ error: 'An error occurred while adding deposit history.' });
                  } else {
                    // Add notification to the notifications table
                    const notificationMessage = `You have Deposited amount of ${amount} USDT.`;
    
                    const addNotificationQuery = 'INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, ?, ?)';
                    db.query(addNotificationQuery, [userId, notificationMessage, 0, timestamp], (notificationError) => {
                      if (notificationError) {
                        console.error(notificationError);
                        res.status(500).json({ error: 'An error occurred while adding notification.' });
                      } else {
                        res.status(200).json({
                          message: 'Amount Deposited Successfully',
                          updatedBalance: updatedBalance,
                        });
                      }
                    });
                  }
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
  

  

// // ######## FETCH DEPOSIT HISTORY ######### //

const fetch_deposit_history_by_admin = (req, res) => {
    try {
      const userId = req.params.userId; 
      
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
  

  // // ######## BLOCK THE USER'S ACCOUNT BY ADMIN ######### //
  

  const block_the_user_account = (req, res) => {
    try {
      const adminId = req.body.adminId;
      const userId = req.params.userId;

       
    const logged_in_user_id = req.user.adminId;


    // if (adminId != logged_in_user_id) {
    //   return res
    //     .status(401)
    //     .json({ error: "You are not allowed to block the user" });
    // }
  
      // Check if the admin exists and has the authority to block users
      const sqlCheckAdmin = `
        SELECT * FROM users WHERE id = ? AND role = 'admin'
      `;
  
      db.query(sqlCheckAdmin, [adminId], (checkAdminError, checkAdminResult) => {
        if (checkAdminError) {
          console.error(checkAdminError);
          return res.status(500).json({ error: "Failed to block user" });
        }
  
        if (checkAdminResult.length === 0) {
          return res.status(403).json({ error: "Admin not authorized" });
        }
  
        // Block the user
        const sqlBlockUser = `
          UPDATE users SET is_active = 0 WHERE id = ?
        `;
  
        db.query(sqlBlockUser, [userId], (blockUserError) => {
          if (blockUserError) {
            console.error(blockUserError);
            return res.status(500).json({ error: "Failed to block user" });
          }
  
          res.status(200).json({ message: "User blocked successfully" });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to block user" });
    }
  };
  

  
   // // ######## ACTIVATE THE USER'S ACCOUNT BY ADMIN ######### //

  const activate_the_user_account = (req, res) => {
    try {
      const adminId = req.body.adminId;
      const userId = req.params.userId;

       
    const logged_in_user_id = req.user.adminId;


    // if (adminId != logged_in_user_id) {
    //   return res
    //     .status(401)
    //     .json({ error: "You are not allowed to activate the user's account" });
    // }
  
      // Check if the admin exists and has the authority to block users
      const sqlCheckAdmin = `
        SELECT * FROM users WHERE id = ? AND role = 'admin'
      `;
  
      db.query(sqlCheckAdmin, [adminId], (checkAdminError, checkAdminResult) => {
        if (checkAdminError) {
          console.error(checkAdminError);
          return res.status(500).json({ error: "Failed to activate user's account" });
        }
  
        if (checkAdminResult.length === 0) {
          return res.status(403).json({ error: "Admin not authorized" });
        }
  
        // Block the user
        const sqlBlockUser = `
          UPDATE users SET is_active = 1 WHERE id = ?
        `;
  
        db.query(sqlBlockUser, [userId], (blockUserError) => {
          if (blockUserError) {
            console.error(blockUserError);
            return res.status(500).json({ error: "Failed to activate user's account" });
          }
  
          res.status(200).json({ message: "User's account activated successfully" });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to activate user's account" });
    }
  };






   // // ######## GET ALL USERS PROFILE API ######### //

   const get_all_users = async (req, res) => {
    try {
      const { page, limit } = req.query;
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || null; 
  
      let sqlGetAllUsers = `
        SELECT u.*, l.*, r.code AS referral_code, r.referred_by
        FROM users u
        LEFT JOIN levels l ON u.level_id = l.level_id
        LEFT JOIN referral_codes r ON u.id = r.user_id
      `;
  
      // If pageSize is provided, apply pagination
      if (pageSize !== null) {
        const offset = (pageNumber - 1) * pageSize;
        sqlGetAllUsers += `
          LIMIT ? OFFSET ?
        `;
        
        db.query(sqlGetAllUsers, [pageSize, offset], (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch user profiles" });
          }
  
          if (results.length === 0) {
            return res.status(404).json({ error: "No users found" });
          }
  
          const userProfiles = results.map((user) => {
            // Removing sensitive data
            delete user.login_password;
            delete user.withdraw_password;
            return user;
          });
  
          res.status(200).json({ totalUsers: userProfiles.length, userProfiles });
        });
      } else {
        db.query(sqlGetAllUsers, (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch user profiles" });
          }
  
          if (results.length === 0) {
            return res.status(404).json({ error: "No users found" });
          }
  
          const userProfiles = results.map((user) => {
            // Removing sensitive data
            delete user.login_password;
            delete user.withdraw_password;
            return user;
          });
  
          res.status(200).json({ totalUsers: userProfiles.length, userProfiles });
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  

  const get_user_profile_by_admin = async (req, res) => {
    try {
      const userId = req.params.userId;
  
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
  
  

//   ADD EVENTS API CODE




// API endpoint to add events
const add_events =   async (req, res) => {

  try {
   
    const eventImage = req.file;

    // console.log(req.file)

    // Upload event image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(eventImage.path, {
      folder: 'koozai_events',
      use_filename: true
    });

    // Save event details in the events table
    const eventQuery = 'INSERT INTO events (event_img_url) VALUES (?)';
    db.query(eventQuery, [cloudinaryResponse.secure_url], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the event.' });
      }

      res.status(200).json({ message: 'Event added successfully.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};





//  GET ALL EVENTS

const get_all_events = async (req, res) => {
    try {
      const selectEventsQuery = 'SELECT * FROM events';
      db.query(selectEventsQuery, (error, eventsResult) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred while fetching events.' });
        }
  
        const events = eventsResult.map(event => {

           
          return {
            event_id: event.event_id,
            event_img_url: event.event_img_url,
            created_at: event.created_at,
            updated_at: event.updated_at
          };
        });
  
            total_events = events.length
        res.status(200).json({total_events, events });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  };
 




//    EDIT EVENT API CODE


const edit_event = async (req, res) => {
    try {
      const { event_id } = req.params;
      const eventImage = req.file;
  
      // Get the old event image URL from the events table
      const getEventImageUrlQuery = 'SELECT event_img_url FROM events WHERE event_id = ?';
      db.query(getEventImageUrlQuery, [event_id], async (getEventImageUrlError, getEventImageUrlResult) => {
        if (getEventImageUrlError) {
          console.error(getEventImageUrlError);
          return res.status(500).json({ error: 'An error occurred while fetching the old event image URL.' });
        }
  
        const oldEventImageUrl = getEventImageUrlResult[0].event_img_url;
  
        // Upload new event image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(eventImage.path, {
          folder: 'koozai_events',
          use_filename: true
        });
  
        // Delete the old event image from Cloudinary
        const publicId = oldEventImageUrl.split('/').pop().split('.')[0];
        cloudinary.uploader.destroy(`koozai_events/${publicId}`, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: 'An error occurred while deleting the old event image from Cloudinary.' });
          }
  
          // Update event_img_url in the events table
          const updateEventQuery = 'UPDATE events SET event_img_url = ? WHERE event_id = ?';
          db.query(updateEventQuery, [cloudinaryResponse.secure_url, event_id], (updateError, updateResult) => {
            if (updateError) {
              console.error(updateError);
              return res.status(500).json({ error: 'An error occurred while updating the event image.' });
            }
  
            res.status(200).json({ message: 'Event image updated successfully.' });
          });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  };
  
  
  const get_single_event = async (req, res) => {
    try {
        const { event_id } = req.params;
        
        // Query the database to retrieve the event data by event_id
        const getEventQuery = 'SELECT * FROM events WHERE event_id = ?';
        db.query(getEventQuery, [event_id], (getEventError, eventResult) => {
            if (getEventError) {
                console.error(getEventError);
                return res.status(500).json({ error: 'An error occurred while fetching the event.' });
            }

            if (eventResult.length === 0) {
                return res.status(404).json({ error: 'Event not found.' });
            }

            const event = eventResult[0];
            res.status(200).json({ event });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
};


  

  
//   DELETE EVENT API

const delete_event = async (req, res) => {
    try {
      const { event_id } = req.params;
  
      // Get the event image URL from the events table
      const getEventImageUrlQuery = 'SELECT event_img_url FROM events WHERE event_id = ?';
      db.query(getEventImageUrlQuery, [event_id], (getEventImageUrlError, getEventImageUrlResult) => {
        if (getEventImageUrlError) {
          console.error(getEventImageUrlError);
          return res.status(500).json({ error: 'An error occurred while fetching the event image URL.' });
        }
  
        const eventImageUrl = getEventImageUrlResult[0].event_img_url;
  
        // Delete the event image from Cloudinary
        const publicId = eventImageUrl.split('/').pop().split('.')[0];
        cloudinary.uploader.destroy(`koozai_events/${publicId}`, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: 'An error occurred while deleting the event image from Cloudinary.' });
          }
  
          // Delete the entire event entry from the events table
          const deleteEventQuery = 'DELETE FROM events WHERE event_id = ?';
          db.query(deleteEventQuery, [event_id], (deleteEventError, deleteEventResult) => {
            if (deleteEventError) {
              console.error(deleteEventError);
              return res.status(500).json({ error: 'An error occurred while deleting the event from the database.' });
            }
  
            res.status(200).json({ message: 'Event deleted successfully.' });
          });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  };
  
  
  

  
  

//   ADD DATA SETS API CODE


const add_data_sets = (req, res) => {
    const { level_id } = req.body;
  
    // Fetch level details based on level_id
    const fetchLevelSql = 'SELECT * FROM levels WHERE level_id = ?';
    db.query(fetchLevelSql, [level_id], (err, levelResult) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching level details');
      } else {
        const {
          max_data_limit,
          max_sets_per_day,
          withdrawal_limit,
          max_withdrawals_per_day,
          handling_fee
        } = levelResult[0];
  
        // Insert data set with fetched level details
        const insertDataSetSql = 'INSERT INTO data_sets (level_id, max_data_limit, max_sets_per_day, withdrawal_limit, max_withdrawals_per_day, handling_fee) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(
          insertDataSetSql,
          [
            level_id,
            max_data_limit,
            max_sets_per_day,
            withdrawal_limit,
            max_withdrawals_per_day,
            handling_fee
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error adding data set');
            } else {
              res.status(201).send('Data set added successfully');
            }
          }
        );
      }
    });
  };
  
  
  

  




 

//   const add_product = async (req, res) => {
//     const { product_name, product_description, product_price } = req.body;
//     const product_image = req.file;
  
//     try {
//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(product_image.path, {
//         folder: 'koozai_products' 
//       });
  
//       const product_image_url = result.secure_url;
  
//       const insertQuery = `
//         INSERT INTO products (product_name, product_description, product_price, product_image_url)
//         VALUES (?, ?, ?, ?)
//       `;
  
//       await db.query(insertQuery, [product_name, product_description, product_price, product_image_url]);
  
//       res.status(201).json({ message: 'Product added successfully.' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
  

// const add_product = async (req, res) => {
//     const { product_name, product_description, product_price, data_set_id } = req.body;
//     const product_image = req.file;
  
//     try {
//       // Fetch data set details based on data_set_id
//       const fetchDataSetSql = 'SELECT * FROM data_sets WHERE data_set_id = ?';
//       db.query(fetchDataSetSql, [data_set_id], async (err, dataSetResult) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
  
//         const dataSetDetails = dataSetResult[0];
  
//         if (!dataSetDetails) {
//           return res.status(404).json({ error: 'Data set not found' });
//         }
  
//         // Upload image to Cloudinary
//         const result = await cloudinary.uploader.upload(product_image.path, {
//           folder: 'koozai_products'
//         });
  
//         const product_image_url = result.secure_url;
  
//         const insertQuery = `
//           INSERT INTO products (product_name, product_description, product_price, product_image_url, data_set_id)
//           VALUES (?, ?, ?, ?, ?)
//         `;
  
//         await db.query(
//           insertQuery,
//           [product_name, product_description, product_price, product_image_url, data_set_id],
//           (err, result) => {
//             if (err) {
//               console.error(err);
//               return res.status(500).json({ error: 'Internal server error' });
//             }
  
//             res.status(201).json({ message: 'Product added successfully.' });
//           }
//         );
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
  
  
  


// const add_product = async (req, res) => {
//   const { product_name, product_description, product_price, data_set_id } = req.body;
//   const product_image = req.file;

//   try {
//     // Fetch data set details based on data_set_id
//     const fetchDataSetSql = 'SELECT * FROM data_sets WHERE data_set_id = ?';
//     db.query(fetchDataSetSql, [data_set_id], async (err, dataSetResult) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const dataSetDetails = dataSetResult[0];

//       if (!dataSetDetails) {
//         return res.status(404).json({ error: 'Data set not found' });
//       }

//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(product_image.path, {
//         folder: 'koozai_products'
//       });

//       const product_image_url = result.secure_url;

//       const insertQuery = `
//         INSERT INTO products (product_name, product_description, product_price, product_image_url, data_set_id)
//         VALUES (?, ?, ?, ?, ?)
//       `;

//       await db.query(
//         insertQuery,
//         [product_name, product_description, product_price, product_image_url, data_set_id],
//         (err, result) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           res.status(201).json({ message: 'Product added successfully.' });
//         }
//       );
//     });
//   } catch (error) {
//     // console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// const add_product = async (req, res) => {
//     const { product_name, product_description, product_price, data_set_id } = req.body;
//     const product_image = req.file;
  
//     try {
//       // Fetch data set details based on data_set_id
//       const dataSetDetails = await new Promise((resolve, reject) => {
//         const fetchDataSetSql = 'SELECT * FROM data_sets WHERE data_set_id = ?';
//         db.query(fetchDataSetSql, [data_set_id], (err, dataSetResult) => {
//           if (err) {
//             console.error(err);
//             return reject('Internal server error');
//           }
  
//           const dataSet = dataSetResult[0];
//           if (!dataSet) {
//             return reject('Data set not found');
//           }
  
//           resolve(dataSet);
//         });
//       });
  
//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(product_image.path, {
//         folder: 'koozai_products'
//       });

//       console.log(result)
  
//       const product_image_url = result.secure_url;
  
//       // Insert product into the database
//       const insertQuery = `
//         INSERT INTO products (product_name, product_description, product_price, product_image_url, data_set_id)
//         VALUES (?, ?, ?, ?, ?)
//       `;
  
//       await new Promise((resolve, reject) => {
//         db.query(
//           insertQuery,
//           [product_name, product_description, product_price, product_image_url, data_set_id],
//           (err, result) => {
//             if (err) {
//               console.error(err);
//               return reject('Internal server error');
//             }
  
//             resolve(result);
//           }
//         );
//       });
  
//       res.status(201).json({ message: 'Product added successfully.' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };
 


const add_product = async (req, res) => {
  const { product_name,  product_price } = req.body;
  const product_image = req.file;




  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(product_image.path, {
      folder: 'koozai_products'
    });

    const product_image_url = result.secure_url;

     // Generate a random id (not recommended for guaranteed uniqueness)
     const generatedId = '970' + Math.floor(Math.random() * 1000000000000);

    // Insert product into the database without data_set_id
    const insertQuery = `
      INSERT INTO products (id,product_name,  product_price, product_image_url)
      VALUES (?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      db.query(
        insertQuery,
        [generatedId, product_name, product_price, product_image_url],
        (err, result) => {
          if (err) {
            console.error(err);
            return reject('Internal server errorr');
          }

          resolve(result);
        }
      );
    });

    res.status(201).json({ message: 'Product added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  


//   GET ALL PRODUCTS API

  const get_all_products = async (req, res) => {
    try {
      const selectProductsQuery = 'SELECT * FROM products';
      db.query(selectProductsQuery, (error, productsResult) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred while fetching products.' });
        }
  
        const products = productsResult.map(product => {
          return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_image_url: product.product_image_url
          };
        });
        
        const total_products = products.length
  
        res.status(200).json({total_products, products });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  };




  // ##### GET SINGLE PRODUCT


  const get_single_product = async (req,res)=>{
    try {
      const product_id = req.params.product_id;

      // Query the database to get the product by ID
      const getProductQuery = 'SELECT * FROM products WHERE product_id = ?';

      db.query(getProductQuery, [product_id], (err, result) => {
          if (err) {
              console.error('Error fetching product:', err);
              return res.status(500).json({ error: 'Internal server error' });
          }

          if (result.length === 0) {
              // If the product with the specified ID is not found, return a 404 error
              return res.status(404).json({ error: 'Product not found' });
          }

          // If the product is found, return it in the response
          res.status(200).json(result[0]);
      });
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
  }

  }
  


  // ###### EDIT PRODUCT API CODE 

  const edit_product = async (req, res) => {
    try {
      const product_id = req.params.product_id;
      const { product_name, product_price } = req.body;
      const product_image = req.file;
  
     
  
      // Check if a new image is provided
      let product_image_url = null;
      if (product_image) {
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(product_image.path, {
          folder: 'koozai_products'
        });
        product_image_url = result.secure_url;
  
        // Extract the public ID from the existing product image URL
        const selectProductQuery = 'SELECT product_image_url FROM products WHERE product_id = ?';
        const [existingProduct] = await new Promise((resolve, reject) => {
          db.query(selectProductQuery, [product_id], (err, result) => {
            if (err) {
              console.error('Error fetching existing product:', err);
              return reject('Internal server error');
            }
            resolve(result);
          });
        });
  
        // Check if the existing product is found
        if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        // Delete the previously saved image in Cloudinary if it exists
        if (existingProduct.product_image_url) {
          const publicId = existingProduct.product_image_url.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`koozai_products/${publicId}`, {
            invalidate: true
          });
        }
      } else {
        // If no new image is provided, fetch the existing image URL from the database
        const selectProductQuery = 'SELECT product_image_url FROM products WHERE product_id = ?';
        const [existingProduct] = await new Promise((resolve, reject) => {
          db.query(selectProductQuery, [product_id], (err, result) => {
            if (err) {
              console.error('Error fetching existing product:', err);
              return reject('Internal server error');
            }
            resolve(result);
          });
        });
  
        // Check if the existing product is found
        if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        if (existingProduct.product_image_url) {
          product_image_url = existingProduct.product_image_url;
        }
      }
  
      // Update product in the database
      const updateQuery = `
        UPDATE products
        SET product_name = ?, product_price = ?, product_image_url = ?
        WHERE product_id = ?
      `;
  
      await new Promise((resolve, reject) => {
        db.query(
          updateQuery,
          [product_name, product_price, product_image_url, product_id],
          (err, result) => {
            if (err) {
              console.error('Error updating product:', err);
              return reject('Internal server error');
            }
            resolve(result);
          }
        );
      });
  
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      // console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  
  
  
  













  // #### DELETE PRODUCT API CODE


  const delete_product = (req, res) => {
    try {
      const product_id = req.params.product_id;
  
      // Use a transaction to ensure both deletions succeed or fail together
      db.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        // Delete the record from the user_products table first
        const deleteUserProductsQuery = 'DELETE FROM user_products WHERE product_id = ?';
  
        db.query(deleteUserProductsQuery, [product_id], (err, userProductsResult) => {
          if (err) {
            db.rollback(() => {
              console.error('Error deleting user_products records:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            });
          }
  
          // Delete the record from the products table
          const deleteProductsQuery = 'DELETE FROM products WHERE product_id = ?';
  
          db.query(deleteProductsQuery, [product_id], (err, productsResult) => {
            if (err) {
              db.rollback(() => {
                console.error('Error deleting product:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              });
            }
  
            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
                });
              }
  
              if (productsResult.affectedRows === 0) {
                // Product with the specified ID was not found
                return res.status(404).json({ error: 'Product not found' });
              }
  
              // Product and related records successfully deleted
              res.status(200).json({ message: 'Product deleted successfully' });
            });
          });
        });
      });
    } catch (error) {
      // console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  

//   const get_all_products = async (req, res) => {
//     try {
//       const { page, limit } = req.query;
  
//       // Convert page and limit to integers
//       const pageNumber = parseInt(page) || 1;
//       const pageSize = parseInt(limit) || null;
  
//       let sqlGetAllProducts = 'SELECT COUNT(*) AS totalProducts FROM products;';
  
//       // If pageSize is provided, apply pagination
//       if (pageSize !== null) {
//         const offset = (pageNumber - 1) * pageSize;
//         sqlGetAllProducts += `
//           SELECT * FROM products
//           LIMIT ? OFFSET ?
//         `;
  
//         db.query(sqlGetAllProducts, [pageSize, offset], (error, results) => {
//           if (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to fetch products' });
//           }
  
//           if (results.length === 0) {
//             return res.status(404).json({ error: 'No products found' });
//           }
  
//           const products = results.map(product => {
//             return {
//               product_id: product.product_id,
//               product_name: product.product_name,
//               product_description: product.product_description,
//               product_price: product.product_price,
//               product_image_url: product.product_image_url
//             };
//           });
  
//           res.status(200).json({ totalProducts: results[0].totalProducts, products });
//         });
//       } else {
//         db.query(sqlGetAllProducts, (error, results) => {
//           if (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to fetch products' });
//           }
  
//           if (results.length === 0) {
//             return res.status(404).json({ error: 'No products found' });
//           }
  
//           res.status(200).json({ totalProducts: results[0].totalProducts });
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   };

  


  
  
// Define an endpoint for resetting a user's account

// const reset_user_account = (req, res) => {
//   const { user_id } = req.body;

//   // Update user's data_completed and sets_completed_today to reset their account
//   const resetAccountSql = 'UPDATE users SET data_completed = 0, merge_count = 0, frozen_count = 0 WHERE id = ?';

//   // Update user_frozen_products table
//   const resetFrozenProductsSql = 'DELETE FROM user_frozen_products WHERE user_id = ?';

//   // Update user_merged_products table
//   const resetMergedProductsSql = 'DELETE FROM user_merged_products WHERE user_id = ?';

//   db.beginTransaction((err) => {
//     if (err) {
//       console.error('Error starting a transaction: ' + err.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // Reset user account in the 'users' table
//     db.query(resetAccountSql, [user_id], (err, result) => {
//       if (err) {
//         db.rollback(() => {
//           console.error('Error resetting user account: ' + err.message);
//           return res.status(500).json({ error: 'Internal server error' });
//         });
//       }

//       // Check if any rows were affected (i.e., if the user ID was valid)
//       if (result.affectedRows === 0) {
//         db.rollback(() => {
//           return res.status(404).json({ error: 'User not found' });
//         });
//       }

//       // Reset user_frozen_products table
//       db.query(resetFrozenProductsSql, [user_id], (err) => {
//         if (err) {
//           db.rollback(() => {
//             console.error('Error resetting user_frozen_products table: ' + err.message);
//             return res.status(500).json({ error: 'Internal server error' });
//           });
//         }

//         // Reset user_merged_products table
//         db.query(resetMergedProductsSql, [user_id], (err) => {
//           if (err) {
//             db.rollback(() => {
//               console.error('Error resetting user_merged_products table: ' + err.message);
//               return res.status(500).json({ error: 'Internal server error' });
//             });
//           }

//           // Commit the transaction
//           db.commit((err) => {
//             if (err) {
//               db.rollback(() => {
//                 console.error('Error committing transaction: ' + err.message);
//                 return res.status(500).json({ error: 'Internal server error' });
//               });
//             }

//             // Account successfully reset
//             return res.status(200).json({ message: 'User account reset successfully' });
//           });
//         });
//       });
//     });
//   });
// };




const reset_user_account = (req, res) => {
  const { user_id } = req.body;

  // Update user's data_completed and sets_completed_today to reset their account
  const resetAccountSql = 'UPDATE users SET data_completed = 0, merge_count = 0, frozen_count = 0' +
                          ' WHERE id = ? ';

  // Update commission to 0 if sets_completed_today is 2
  const updateCommissionSql = 'UPDATE users SET commission = 0 WHERE id = ? AND sets_completed_today = 2';

  // Update user_frozen_products table
  const resetFrozenProductsSql = 'DELETE FROM user_frozen_products WHERE user_id = ?';

  // Update user_merged_products table
  const resetMergedProductsSql = 'DELETE FROM user_merged_products WHERE user_id = ?';

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting a transaction: ' + err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Reset user account in the 'users' table (excluding sets_completed_today = 2)
    db.query(resetAccountSql, [user_id], (err, result) => {
      if (err) {
        db.rollback(() => {
          console.error('Error resetting user account: ' + err.message);
          return res.status(500).json({ error: 'Internal server error' });
        });
      }

      // Check if any rows were affected (i.e., if the user ID was valid and sets_completed_today is not 2)
      if (result.affectedRows === 0) {
        db.rollback(() => {
          return res.status(404).json({ error: 'User not found or sets_completed_today is 2' });
        });
      }

      // Update commission to 0 if sets_completed_today is 2
      db.query(updateCommissionSql, [user_id], (err) => {
        if (err) {
          db.rollback(() => {
            console.error('Error updating commission: ' + err.message);
            return res.status(500).json({ error: 'Internal server error' });
          });
        }

        // Reset user_frozen_products table
        db.query(resetFrozenProductsSql, [user_id], (err) => {
          if (err) {
            db.rollback(() => {
              console.error('Error resetting user_frozen_products table: ' + err.message);
              return res.status(500).json({ error: 'Internal server error' });
            });
          }

          // Reset user_merged_products table
          db.query(resetMergedProductsSql, [user_id], (err) => {
            if (err) {
              db.rollback(() => {
                console.error('Error resetting user_merged_products table: ' + err.message);
                return res.status(500).json({ error: 'Internal server error' });
              });
            }

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  console.error('Error committing transaction: ' + err.message);
                  return res.status(500).json({ error: 'Internal server error' });
                });
              }

              // Account successfully reset
              return res.status(200).json({ message: 'User account reset successfully' });
            });
          });
        });
      });
    });
  });
};


// // Define an endpoint for checking if the user can start a new set
// app.get('/can-start-new-set/:user_id', (req, res) => {
//   const { user_id } = req.params;

//   // Fetch user's sets_completed_today count
//   const fetchSetsCompletedTodaySql = 'SELECT sets_completed_today FROM users WHERE id = ?';

//   db.query(fetchSetsCompletedTodaySql, [user_id], (err, result) => {
//     if (err) {
//       console.error('Error fetching sets completed today: ' + err.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // Check if any rows were affected (i.e., if the user ID was valid)
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const setsCompletedToday = result[0].sets_completed_today;

//     // Check if the user can start a new set (limit to 2 sets per day)
//     const canStartNewSet = setsCompletedToday < 2;

//     return res.status(200).json({ can_start_new_set: canStartNewSet });
//   });
// });








  


// ##### SET MERGE TARGET API CODE

const set_merge_product = (req, res) => {
  const { user_id, product_id, merge_target } = req.body;

  // Insert the merge_target into a new line in user_merge_targets
  const insertUserMergeTargetQuery = 'INSERT INTO user_merged_products (user_id, product_id, merge_target) VALUES (?, ?, ?)';

  db.query(insertUserMergeTargetQuery, [user_id, product_id, merge_target], (err) => {
    if (err) {
      console.error('Error inserting user merge target:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Fetch the user's current merge_count from the users table
    const getUserMergeCountQuery = 'SELECT merge_count FROM users WHERE id = ?';
    db.query(getUserMergeCountQuery, [user_id], (err, userResult) => {
      if (err) {
        console.error('Error fetching user merge count:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (userResult.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const merge_count = userResult[0].merge_count;

      // Fetch the max merge limit for the merge_target
      const checkMergeLimitQuery = 'SELECT max_limit FROM user_merged_products WHERE user_id = ? AND merge_target = ?';
      db.query(checkMergeLimitQuery, [user_id, merge_target], (err, mergeLimitResult) => {
        if (err) {
          console.error('Error fetching merge limit data:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (mergeLimitResult.length === 0) {
          return res.status(400).json({ error: 'User merge target not found' });
        }

        const  max_merge_limit  = mergeLimitResult[0].max_limit;

        

        // Check if the merge count is greater than or equal to the max merge limit
        if (merge_count >= max_merge_limit) {
          return res.status(400).json({ error: `Maximum merge limit reached for the user ${user_id}` });
        }

        // Fetch the product's price
        const getProductPriceQuery = 'SELECT product_price FROM products WHERE product_id = ?';
        db.query(getProductPriceQuery, [product_id], (err, productResult) => {
          if (err) {
            console.error('Error fetching product price:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (productResult.length === 0) {
            return res.status(400).json({ error: 'Product not found' });
          }

          const productPrice = productResult[0].product_price;

          // Update the user's merge_count in the users table
          const updateUserMergeCountQuery = 'UPDATE users SET merge_count = ? WHERE id = ?';
          const newMergeCount = merge_count + 1;
          
          if (newMergeCount <= merge_count) {
            return res.status(400).json({ error: 'Merge count cannot be decreased' });
          }
          
          db.query(updateUserMergeCountQuery, [newMergeCount, user_id], (err) => {
            if (err) {
              console.error('Error updating user merge count:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            // No need to update the user's balance since it's not debited
            res.status(200).json({ message: 'Product assigned for Merged successfully' });
          });
        });
      });
    });
  });
};



// ###### SET FROZEN TARGET API CODE 

const set_frozen_product = (req, res) => {
  const { user_id, product_id, frozen_target } = req.body;

  // Insert the merge_target into a new line in user_merge_targets
  const insertUserFrozenTargetQuery = 'INSERT INTO user_frozen_products (user_id, product_id, frozen_target) VALUES (?, ?, ?)';

  db.query(insertUserFrozenTargetQuery, [user_id, product_id, frozen_target], (err) => {
    if (err) {
      console.error('Error inserting user frozn target:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Fetch the user's current merge_count from the users table
    const getUserFrozenCountQuery = 'SELECT frozen_count FROM users WHERE id = ?';
    db.query(getUserFrozenCountQuery, [user_id], (err, userResult) => {
      if (err) {
        console.error('Error fetching user frozen count:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (userResult.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const frozen_count = userResult[0].frozen_count;

      // Fetch the max merge limit for the merge_target
      const checkFrozenLimitQuery = 'SELECT max_limit FROM user_frozen_products WHERE user_id = ? AND frozen_target = ?';
      db.query(checkFrozenLimitQuery, [user_id, frozen_target], (err, frozenLimitResult) => {
        if (err) {
          console.error('Error fetching frozen limit data:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (frozenLimitResult.length === 0) {
          return res.status(400).json({ error: 'User frozen target not found' });
        }

        const  max_frozen_limit  = frozenLimitResult[0].max_limit;

        

        // Check if the merge count is greater than or equal to the max merge limit
        if (frozen_count >= max_frozen_limit ) {
          return res.status(400).json({ error: `Maximum Frozen limit reached for the user ${user_id}` });
        }

        // Fetch the product's price
        const getProductPriceQuery = 'SELECT product_price FROM products WHERE product_id = ?';
        db.query(getProductPriceQuery, [product_id], (err, productResult) => {
          if (err) {
            console.error('Error fetching product price:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (productResult.length === 0) {
            return res.status(400).json({ error: 'Product not found' });
          }

          const productPrice = productResult[0].product_price;

          // Update the user's merge_count in the users table
          const updateUserFrozenCountQuery = 'UPDATE users SET frozen_count = ? WHERE id = ?';
          const newFrozenCount = frozen_count + 1;
          
          if (newFrozenCount <= frozen_count) {
            return res.status(400).json({ error: 'frozen count cannot be decreased' });
          }
          
          db.query(updateUserFrozenCountQuery, [newFrozenCount, user_id], (err) => {
            if (err) {
              console.error('Error updating user frozen count:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }

            // No need to update the user's balance since it's not debited
            res.status(200).json({ message: 'Product assigned for Frozen successfully' });
          });
        });
      });
    });
  });
};



//####### RESET FORGOT PASSWORD ##########




// Controller function to reset a user's password
const reset_forgot_password = (req, res) => {
  const { userId, newPassword, confirmNewPassword } = req.body;

  // Check if the newPassword and confirmNewPassword match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match' });
  }

  // Hash the new password before storing it in the database
  bcrypt.hash(newPassword, 10, (hashError, hashedPassword) => {
    if (hashError) {
      // console.error(hashError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if the user exists
    db.query('SELECT * FROM users WHERE id = ?', [userId], (userQueryError, userRows) => {
      if (userQueryError) {
        // console.error(userQueryError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update the user's password
      db.query('UPDATE users SET login_password = ? WHERE id = ?', [hashedPassword, userId], (updateError) => {
        if (updateError) {
          // console.error(updateError);
          return res.status(500).json({ error: 'Internal server error',updateError });
        }

        res.status(200).json({ message: 'Password changed successfully' });
      });
    });
  });
};




// ##### GET ALL WITHDRAWLS REQUESTS



const get_all_withdrawals_requests = (req, res) => {
  try {
    // Fetch all withdrawal records from the database
   const getAllWithdrawalsQuery = `
    SELECT withdraw_requests.id, 
           withdraw_requests.user_id, 
           users.username, 
           users.balance, 
           withdraw_requests.amount, 
           withdraw_requests.status
    FROM withdraw_requests
    INNER JOIN users ON withdraw_requests.user_id = users.id`;

    db.query(getAllWithdrawalsQuery, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching withdrawal history.' });
      } else {
        // Return the list of withdrawal records
        res.status(200).json({ withdrawals: result });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};





// ##### Update the DEPOSIT REQUEST< APPROVE OR CANCEL


// const complete_withdrawal_request = (req, res) => {
//   try {
//     const requestId = req.params.requestId;
//     const withdrawnAmount = req.body.withdrawnAmount;
//     const action = req.body.action; // Add an 'action' field in the request to specify approve or reject

//     // Check if withdrawnAmount is <= 0
//     if (withdrawnAmount <= 0) {
//       return res.status(400).json({ error: 'Please Enter a valid Amount to Withdraw.' });
//     }

//     // Check if the withdrawal request status is already completed
//     const checkStatusQuery = 'SELECT status FROM withdraw_requests WHERE id = ?';
//     db.query(checkStatusQuery, [requestId], (checkStatusError, checkStatusResult) => {
//       if (checkStatusError) {
//         console.error(checkStatusError);
//         res.status(500).json({ error: 'An error occurred while checking withdrawal request status.' });
//       } else if (checkStatusResult.length === 0) {
//         res.status(404).json({ error: 'Withdrawal request not found.' });
//       } else {
//         const currentStatus = checkStatusResult[0].status;
//         if (currentStatus === 'completed') {
//           res.status(400).json({ error: 'This withdrawal request is already approved and completed.' });
//         } else {
//           // Update the status of the withdrawal request based on the action (approve or reject)
//           const newStatus = action === 'approve' ? 'completed' : 'rejected';
//           const updateQuery = 'UPDATE withdraw_requests SET status = ?, amount = ? WHERE id = ?';
//           db.query(updateQuery, [newStatus, withdrawnAmount, requestId], (updateError, updateResult) => {
//             if (updateError) {
//               console.error(updateError);
//               res.status(500).json({ error: 'An error occurred while updating withdrawal status and amount.' });
//             } else if (updateResult.affectedRows === 0) {
//               res.status(404).json({ error: 'Withdrawal request not found.' });
//             } else if (action === 'approve') {
//               // Deduct the withdrawn amount from the user's balance
//               const userIdQuery = 'SELECT user_id FROM withdraw_requests WHERE id = ?';
//               db.query(userIdQuery, [requestId], (userIdError, userIdResult) => {
//                 if (userIdError) {
//                   console.error(userIdError);
//                   res.status(500).json({ error: 'An error occurred while retrieving user ID.' });
//                 } else {
//                   const userId = userIdResult[0].user_id;
//                   const getUserBalanceQuery = 'SELECT balance FROM users WHERE id = ?';
//                   db.query(getUserBalanceQuery, [userId], (balanceError, balanceResult) => {
//                     if (balanceError) {
//                       console.error(balanceError);
//                       res.status(500).json({ error: 'An error occurred while retrieving user balance.' });
//                     } else {
//                       const currentBalance = balanceResult[0].balance;
//                       const updatedBalance = currentBalance - withdrawnAmount;

//                       // Update user balance
//                       const updateBalanceQuery = 'UPDATE users SET balance = ? WHERE id = ?';
//                       db.query(updateBalanceQuery, [updatedBalance, userId], (updateBalanceError) => {
//                         if (updateBalanceError) {
//                           console.error(updateBalanceError);
//                           res.status(500).json({ error: 'An error occurred while updating user balance.' });
//                         } else {
//                           if (action === 'approve') {
//                             // Insert a record into the withdraw_history table for approval
//                             const insertHistoryQuery = 'INSERT INTO withdraw_history (user_id, amount, date) VALUES (?, ?, CURDATE())';
//                             db.query(insertHistoryQuery, [userId, withdrawnAmount], (insertHistoryError, insertHistoryResult) => {
//                               if (insertHistoryError) {
//                                 console.error(insertHistoryError);
//                                 res.status(500).json({ error: 'An error occurred while inserting into withdraw_history.' });
//                               } else {
//                                 res.status(200).json({
//                                   message: 'Withdrawal request completed Successfully',
//                                   updatedBalance,
//                                 });
//                               }
//                             });
//                           } else {
//                             res.status(200).json({
//                               message: 'Withdrawal request rejected Successfully',
//                               updatedBalance,
//                             });
//                           }
//                         }
//                       });
//                     }
//                   });
//                 }
//               });
//             } else {
//               // If the action is 'reject', simply respond with a success message
//               res.status(200).json({
//                 message: 'Withdrawal request rejected Successfully',
                
//               });
//             }
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// };







const complete_withdrawal_request = (req, res) => {
  try {
    const requestId = req.params.requestId;
    const action = req.body.action; // Add an 'action' field in the request to specify approve or reject

    // Check if the withdrawal request status is already completed
    const checkStatusQuery = 'SELECT status FROM withdraw_requests WHERE id = ?';
    db.query(checkStatusQuery, [requestId], (checkStatusError, checkStatusResult) => {
      if (checkStatusError) {
        console.error(checkStatusError);
        res.status(500).json({ error: 'An error occurred while checking withdrawal request status.' });
      } else if (checkStatusResult.length === 0) {
        res.status(404).json({ error: 'Withdrawal request not found.' });
      } else {
        const currentStatus = checkStatusResult[0].status;
        if (currentStatus === 'completed') {
          res.status(400).json({ error: 'This withdrawal request is already approved and completed.' });
        } else {
          if (action === 'approve') {
            // User is approving the request
            const withdrawnAmount = req.body.withdrawnAmount;
            
            // Check if withdrawnAmount is <= 0
            if (withdrawnAmount <= 0) {
              return res.status(400).json({ error: 'Please Enter a valid Amount to Withdraw.' });
            }

            // Deduct the withdrawn amount from the user's balance
            const userIdQuery = 'SELECT user_id FROM withdraw_requests WHERE id = ?';
            db.query(userIdQuery, [requestId], (userIdError, userIdResult) => {
              if (userIdError) {
                console.error(userIdError);
                res.status(500).json({ error: 'An error occurred while retrieving user ID.' });
              } else {
                const userId = userIdResult[0].user_id;
                const getUserBalanceQuery = 'SELECT balance FROM users WHERE id = ?';
                db.query(getUserBalanceQuery, [userId], (balanceError, balanceResult) => {
                  if (balanceError) {
                    console.error(balanceError);
                    res.status(500).json({ error: 'An error occurred while retrieving user balance.' });
                  } else {
                    const currentBalance = balanceResult[0].balance;
                    if (currentBalance < withdrawnAmount) {
                      res.status(400).json({ error: 'Insufficient balance for withdrawal.' });
                    } else {
                      const updatedBalance = currentBalance - withdrawnAmount;

                      // Update user balance
                      const updateBalanceQuery = 'UPDATE users SET balance = ? WHERE id = ?';
                      db.query(updateBalanceQuery, [updatedBalance, userId], (updateBalanceError) => {
                        if (updateBalanceError) {
                          console.error(updateBalanceError);
                          res.status(500).json({ error: 'An error occurred while updating user balance.' });
                        } else {
                          // Update the status of the withdrawal request to 'completed' and update the amount
                          const newStatus = 'completed';
                          const updateQuery = 'UPDATE withdraw_requests SET status = ?, amount = ? WHERE id = ?';
                          db.query(updateQuery, [newStatus, withdrawnAmount, requestId], (updateError, updateResult) => {
                            if (updateError) {
                              console.error(updateError);
                              res.status(500).json({ error: 'An error occurred while updating withdrawal status and amount.' });
                            } else if (updateResult.affectedRows === 0) {
                              res.status(404).json({ error: 'Withdrawal request not found.' });
                            } else {
                              // Insert a record into the withdraw_history table for approval
                              const insertHistoryQuery = 'INSERT INTO withdraw_history (user_id, amount, date) VALUES (?, ?, CURDATE())';
                              db.query(insertHistoryQuery, [userId, withdrawnAmount], (insertHistoryError, insertHistoryResult) => {
                                if (insertHistoryError) {
                                  console.error(insertHistoryError);
                                  res.status(500).json({ error: 'An error occurred while inserting into withdraw_history.' });
                                } else {
                                  res.status(200).json({
                                    message: 'Withdrawal request completed Successfully',
                                    updatedBalance,
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          } else if (action === 'reject') {
            // User is rejecting the request
            // Update the status of the withdrawal request to 'rejected' (no need to update the amount)
            const newStatus = 'rejected';
            const updateQuery = 'UPDATE withdraw_requests SET status = ? WHERE id = ?';
            db.query(updateQuery, [newStatus, requestId], (updateError, updateResult) => {
              if (updateError) {
                console.error(updateError);
                res.status(500).json({ error: 'An error occurred while updating withdrawal status.' });
              } else if (updateResult.affectedRows === 0) {
                res.status(404).json({ error: 'Withdrawal request not found.' });
              } else {
                res.status(200).json({
                  message: 'Withdrawal request rejected Successfully',
                });
              }
            });
          } else {
            res.status(400).json({ error: 'Invalid action. Please specify "approve" or "reject".' });
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};



// ####### WITHDRAW HISTORY API CODE


const get_withdraw_history_by_admin = (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database to retrieve withdrawal history for the specified user
    // const historyQuery = 'SELECT * FROM withdraw_history WHERE user_id = ?';
    const historyQuery = 'SELECT wh.*, u.username FROM withdraw_history wh ' +
                   'JOIN users u ON wh.user_id = u.id ' +
                   'WHERE wh.user_id = ?';

    db.query(historyQuery, [userId], (historyError, historyResult) => {
      if (historyError) {
        console.error(historyError);
        res.status(500).json({ error: 'An error occurred while retrieving withdrawal history.' });
      } else {
        res.status(200).json({ withdrawalHistory: historyResult });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

  
  
// $$$$###### EDIT WALLET ADDRESS BY ADMIN


const edit_wallet_by_admin = async (req, res) => {
  try {
    const { user_id, full_name, crypto_exchange_platform, usdt_trc20_address, phone } = req.body;

    

    // Check if any of the required fields are missing
    if (!full_name || !crypto_exchange_platform || !usdt_trc20_address || !phone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if the user already has a bound wallet
    const existingWalletQuery = 'SELECT * FROM bind_wallet WHERE user_id = ?';
    db.query(existingWalletQuery, [user_id], (existingWalletError, existingWalletResult) => {
      if (existingWalletError) {
        console.error(existingWalletError);
        return res.status(500).json({ error: 'An error occurred while checking existing wallet.' });
      }

      if (existingWalletResult.length === 0) {
        return res.status(404).json({ error: 'No wallet found for this user.' });
      }

      // Update wallet details in the bind_wallet table
      const updateWalletQuery = 'UPDATE bind_wallet SET full_name=?, crypto_exchange_platform=?, usdt_trc20_address=?, phone=? WHERE user_id = ?';
      db.query(
        updateWalletQuery,
        [full_name, crypto_exchange_platform, usdt_trc20_address, phone, user_id],
        (updateError, updateResult) => {
          if (updateError) {
            console.error(updateError);
            res.status(500).json({ error: 'An error occurred while updating the wallet.' });
          } else {
            res.status(200).json({ message: 'Wallet successfully updated!' });
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

  
  
// ###### GET WALLET BY ADMIN API CODE ############


const get_wallet_by_admin = async (req, res) => {
  try {
    const user_id = req.params.userId; 

    
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


// ###### GET ALL LEVELS BY ADMIN API CODE ############


const get_levels_by_admin = async (req, res) => {
  try {
    
    
    // Query the database to retrieve level information 
    const query = 'SELECT * FROM levels';
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(200).json({ levels: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
  
  


// @@$$$$$#### UPDATE LEVEL OF USER

const update_user_level_by_admin = async (req, res) => {
  try {
    const { userId, levelId } = req.body;

    // Validate if user and level IDs are provided
    if (!userId || !levelId) {
      return res.status(400).json({ error: 'Both user ID and level ID are required.' });
    }

    // Check if the user with the provided user ID exists
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserQuery, [userId], (checkUserError, checkUserResults) => {
      if (checkUserError) {
        console.error(checkUserError);
        return res.status(500).json({ error: 'An error occurred while checking the user.' });
      }

      if (checkUserResults.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Check if the level with the provided level ID exists
      const checkLevelQuery = 'SELECT * FROM levels WHERE level_id = ?';
      db.query(checkLevelQuery, [levelId], (checkLevelError, checkLevelResults) => {
        if (checkLevelError) {
          console.error(checkLevelError);
          return res.status(500).json({ error: 'An error occurred while checking the level.' });
        }

        if (checkLevelResults.length === 0) {
          return res.status(404).json({ error: 'Level not found.' });
        }

        // Update the user's level in the database
        const updateLevelQuery = 'UPDATE users SET level_id = ? WHERE id = ?';
        db.query(updateLevelQuery, [levelId, userId], (updateLevelError, updateLevelResults) => {
          if (updateLevelError) {
            console.error(updateLevelError);
            return res.status(500).json({ error: 'An error occurred while updating the user level.' });
          }

          // Query the updated user's level
          const getUserLevelQuery = 'SELECT level_name FROM levels WHERE level_id = ?';
          db.query(getUserLevelQuery, [levelId], (getUserLevelError, getUserLevelResults) => {
            if (getUserLevelError) {
              console.error(getUserLevelError);
              return res.status(500).json({ error: 'An error occurred while fetching the updated user level.' });
            }

            const updatedLevel = getUserLevelResults[0].level_name;
            
            // Include the updated user's level in the response
            res.status(200).json({ message: 'User level updated successfully.', updatedLevel });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};




// $##### ADMIN LOGOUT API


const admin_logout = (req, res) => {
  try {
    // Clear the admin_token cookie to log out the admin
    res.clearCookie("admin_token");

    res.status(200).json({ message: "Admin logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Admin logout failed" });
  }
};










  
module.exports = {

    admin_login,
    get_deposit_requests,
    get_single_deposit_request,
    complete_deposit_request,
    reject_deposit_request,
    deposit_direct,
    fetch_deposit_history_by_admin,
    block_the_user_account,
    activate_the_user_account,
    get_all_users,
    get_user_profile_by_admin,
    add_events,
    get_all_events,
    edit_event,
    get_single_event,
    delete_event,
    add_data_sets,
    add_product,
    get_all_products,
    get_single_product,
    edit_product,
    delete_product,
    reset_user_account,
    set_merge_product,
    set_frozen_product,
    reset_forgot_password,
    get_all_withdrawals_requests,
    complete_withdrawal_request,
    get_withdraw_history_by_admin,
    edit_wallet_by_admin,
    get_wallet_by_admin,
    get_levels_by_admin,
    update_user_level_by_admin,
    admin_logout
    
  
   
  };
  