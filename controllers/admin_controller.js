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
  const { product_name, product_description, product_price } = req.body;
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
      INSERT INTO products (id,product_name, product_description, product_price, product_image_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      db.query(
        insertQuery,
        [generatedId, product_name, product_description, product_price, product_image_url],
        (err, result) => {
          if (err) {
            console.error(err);
            return reject('Internal server error');
          }

          resolve(result);
        }
      );
    });

    res.status(201).json({ message: 'Product added successfully.' });
  } catch (error) {
    // console.error(error);
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
            product_description: product.product_description,
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
      const { product_name, product_description, product_price } = req.body;
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
        SET product_name = ?, product_description = ?, product_price = ?, product_image_url = ?
        WHERE product_id = ?
      `;
  
      await new Promise((resolve, reject) => {
        db.query(
          updateQuery,
          [product_name, product_description, product_price, product_image_url, product_id],
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

const reset_user_account = (req, res) => {
  const { user_id } = req.body;

  // Update user's data_completed and sets_completed_today to reset their account
  const resetAccountSql = 'UPDATE users SET data_completed = 0 WHERE id = ?';

  db.query(resetAccountSql, [user_id], (err, result) => {
    if (err) {
      console.error('Error resetting user account: ' + err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if any rows were affected (i.e., if the user ID was valid)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Account successfully reset
    return res.status(200).json({ message: 'User account reset successfully' });
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








  



// const set_merge_product = (req, res) => {
//   const { user_id, product_id, merge_target } = req.body;

//   // Insert the merge_target into a new line in user_merge_targets
//   const insertUserMergeTargetQuery = 'INSERT INTO user_merge_targets (user_id, product_id, merge_target, merge_count, max_merge_limit) VALUES (?, ?, ?, 0, 3)';

//   db.query(insertUserMergeTargetQuery, [user_id, product_id, merge_target], (err) => {
//     if (err) {
//       console.error('Error inserting user merge target:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // Fetch the user's current merge count and max merge limit for the merge_target
//     const checkMergeLimitQuery = 'SELECT merge_count, max_merge_limit FROM user_merge_targets WHERE user_id = ? AND merge_target = ?';
//     db.query(checkMergeLimitQuery, [user_id, merge_target], (err, mergeLimitResult) => {
//       if (err) {
//         console.error('Error fetching merge limit data:', err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (mergeLimitResult.length === 0) {
//         return res.status(400).json({ error: 'User merge target not found' });
//       }

//       const { merge_count, max_merge_limit } = mergeLimitResult[0];

//       if (merge_count >= max_merge_limit) {
//         return res.status(400).json({ error: `Maximum merge limit reached for merge_target ${merge_target}` });
//       }

//       // Fetch the product's price
//       const getProductPriceQuery = 'SELECT product_price FROM products WHERE product_id = ?';
//       db.query(getProductPriceQuery, [product_id], (err, productResult) => {
//         if (err) {
//           console.error('Error fetching product price:', err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         if (productResult.length === 0) {
//           return res.status(400).json({ error: 'Product not found' });
//         }

//         const productPrice = productResult[0].product_price;

//         // Update the user's merge target and increment merge_count in the user_merge_targets table
//         const updateUserMergeTargetQuery = 'UPDATE user_merge_targets SET product_id = ? AND merge_count = merge_count + 1 WHERE user_id = ? AND merge_target = ?';
//         db.query(updateUserMergeTargetQuery, [user_id,product_id, merge_target], (err) => {
//           if (err) {
//             console.error('Error updating user merge target:', err);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//             // No need to update the user's balance since it's not debited
//             res.status(200).json({ message: 'Product assigned successfully' });
//           });
//       });
//     });
//   });
// };

const set_merge_product = (req, res) => {
  const { user_id, product_id, merge_target } = req.body;

  // Insert the merge_target into a new line in user_merge_targets
  const insertUserMergeTargetQuery = 'INSERT INTO user_merge_targets (user_id, product_id, merge_target) VALUES (?, ?, ?)';

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

      // Update the user's merge_count in the users table
      const updateUserMergeCountQuery = 'UPDATE users SET merge_count = ? WHERE id = ?';
      db.query(updateUserMergeCountQuery, [merge_count + 1, user_id], (err) => {
        if (err) {
          console.error('Error updating user merge count:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Fetch the max merge limit for the merge_target
        const checkMergeLimitQuery = 'SELECT max_merge_limit FROM user_merge_targets WHERE user_id = ? AND merge_target = ?';
        db.query(checkMergeLimitQuery, [user_id, merge_target], (err, mergeLimitResult) => {
          if (err) {
            console.error('Error fetching merge limit data:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (mergeLimitResult.length === 0) {
            return res.status(400).json({ error: 'User merge target not found' });
          }

          const { max_merge_limit } = mergeLimitResult[0];

          // Check if the merge count is greater than or equal to the max merge limit
          if (merge_count >= max_merge_limit) {
            return res.status(400).json({ error: `Maximum merge limit reached for merge_target ${merge_target}` });
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

            // No need to update the user's balance since it's not debited
            res.status(200).json({ message: 'Product assigned successfully' });
          });
        });
      });
    });
  });
};






  
  
  
  
  
  


  
module.exports = {

    admin_login,
    get_deposit_requests,
    get_single_deposit_request,
    complete_deposit_request,
    fetch_deposit_history_by_admin,
    block_the_user_account,
    activate_the_user_account,
    get_all_users,
    get_user_profile_by_admin,
    add_events,
    get_all_events,
    edit_event,
    delete_event,
    add_data_sets,
    add_product,
    get_all_products,
    get_single_product,
    edit_product,
    delete_product,
    reset_user_account,
    set_merge_product,
    
    
    
   
  };
  