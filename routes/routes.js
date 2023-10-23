const express = require("express");
const router = express.Router();
const {validateRegistration,validateLogin } = require('../middlewares/validation.js')
const {authForUser, authForAdmin} = require('../middlewares/auth.js')
const users_controller = require("../controllers/users_controller.js");
const admin_controller = require("../controllers/admin_controller.js");

const multer = require('multer');

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads' });


// new REGISTER user Route

router.post(
    "/user-registration",
    validateRegistration,
    users_controller.user_signup
  );


  // LOGIN user Route

router.post(
  "/user-login",
  validateLogin,
  users_controller.user_login
);
  // LOGOUT user Route

router.post(
  "/user-logout",
  authForUser,
  users_controller.user_logout
);



  // GET user Profile Route

  router.get(
    "/get-user-profile/:userId",
    authForUser,
    users_controller.get_user_profile
  );
  

   // EDIT user Profile Route

   router.put(
    "/edit-user-profile/:userId",
    upload.single('profile_pic'),
    authForUser,
    users_controller.edit_user_profile
  );
  

  
   // Change user Login_password Profile Route

   router.put(
    "/change-login-password",
    authForUser,
    users_controller.change_login_password
  );
  

     // Change user Withdraw_password Profile Route

     router.put(
      "/change-withdraw-password",
      authForUser,
      users_controller.change_withdraw_password
    );


    
     // Depost amount Route

     router.post(
      "/deposit-amount",
      authForUser,
      users_controller.deposit_amount_request
    );
    
    
     // FETCH_DEPOSIT_HISTORY_BY_USER ROUTE

     router.get(
      "/get-deposit-history/:userId",
      authForUser,
      users_controller.fetch_deposit_history_by_user
    );
    

       // WITHDRAW AMOUNT REQUEST

       router.post(
        "/withdraw_amount",
        authForUser,
        users_controller.withdraw_amount_request
      );
      

       // WITHDRAW HISTORY BY USER

       router.get(
        "/withdraw-history-by-user/:userId",
        authForUser,
        users_controller.get_withdraw_history_by_user
      );
      

      
      //  // UPDATE USER LEVEL

      //  router.put(
      //   "/update-user-level",
      //   users_controller.update_user_level
      // );
      

       // BIND WALLET

       router.post(
        "/bind-wallet",
        authForUser,
        users_controller.bind_wallet
      );

      // GET WALLET BY USER

      router.get(
        "/get-wallet-by-user/:userId",
        authForUser,
        users_controller.get_wallet_by_user
      );

      // EDIT WALLET BY USER

      // router.put(
      //   "/edit-wallet",
      //   authForUser,
      //   users_controller.edit_wallet
      // );
      

       // WITHDRAW AMOUNT REQUEST

       router.post(
        "/drive-data",
        authForUser,
        users_controller.drive_data
      );

         // GET ALL PRODUCTS

         router.get(
          "/get-all-data/:user_id",
          authForUser,
          users_controller.get_all_data
        );
  

       // GET PENDING PRODUCTS

       router.get(
        "/get-pending-data/:user_id",
        authForUser,
        users_controller.get_pending_data
      );


      
       // GET COMPLETED PRODUCTS

       router.get(
        "/get-completed-data/:user_id",
        authForUser,
        users_controller.get_completed_data
      );


        // GET FROZEN PRODUCTS

        router.get(
          "/get-frozen-data/:user_id",
          authForUser,
          users_controller.get_frozen_data
        );

        
        // GET TRANSACTION BY STATUS

        router.get(
          "/get-transactions-by-status/:user_id/:status",
          authForUser,
          users_controller.get_transactions_by_status
        );



       // SUBMIT PRODUCT

       router.post(
        "/submit-data",
        authForUser,
        users_controller.submit_data
      );


       // GET NOTIFICATIONS

       router.get(
        "/get-notifications/:userId",
        authForUser,
        users_controller.get_notifications
      );


       // MARK NOTIFICATIONS AS READ

       router.put(
        "/mark-notification-as-read",
        authForUser,
        users_controller.mark_notification_as_read
      );
       // MARK NOTIFICATIONS AS READ

       router.get(
        "/get-all-events",
        users_controller.get_all_events
      );
       // GET DRIVE DATA STATUS

       router.get(
        "/get-drive-data-status/:userId",
        users_controller.fetch_drive_data_status
      );

       // GET CUSTOMER SUPPORT

       router.get(
        "/get-customer-support",
        users_controller.get_customer_support
      );
       // automated requests for reset user account

       router.put(
        "/automated-request-for-reset-user_account",
        users_controller.automated_request_for_reset_user_account
      );

      
    






    // ####### ROUTES FOR ADMIN ####### //


      // Login API route for admin

      router.post(
        "/admin/login",
        admin_controller.admin_login
      );

     
     // Get Depost requests Route

     router.get(
      "/admin/get-deposit-requests",
      authForAdmin,
      admin_controller.get_deposit_requests
      
    );
    
        
     // Get Single Depost request Route

     router.get(
      "/admin/get-single-deposit-request/:requestId",
      authForAdmin,
      admin_controller.get_single_deposit_request
      
    );

    //  // Approve Depost request Route

    //  router.put(
    //   "/admin/approve-deposit-request/:requestId",
    //   authForAdmin,
    //   admin_controller.approve_deposit_request
      
    // );

     // Approve and complete Depost request Route

     router.put(
      "/admin/update-user-balance/:requestId",
      authForAdmin,
      admin_controller.complete_deposit_request
    );


     router.post(
      "/admin/direct-deposit",
      authForAdmin,
      admin_controller.deposit_direct
    );

  // FETCH DEPOSIT HISTORY ROUTE

  router.get(
    "/admin/get-deposit-history/:userId",
    authForAdmin,
    admin_controller.fetch_deposit_history_by_admin
  );

    // BLOCK THE USER BY ADMIN

    router.post(
      "/admin/block-the-user-account/:userId",
      authForAdmin,
      admin_controller.block_the_user_account
    );


      // ACTIVATE THE USER BY ADMIN

      router.post(
        "/admin/activate-the-user-account/:userId",
        authForAdmin,
        admin_controller.activate_the_user_account
      );

        // GET ALL USERS PROFILE ROUTE

        router.get(
          "/admin/get-all-users",
          authForAdmin,
          admin_controller.get_all_users
        );

            // GET ALL USERS PROFILE ROUTE

            router.get(
              "/admin/get-user-profile-by-admin/:userId",
              authForAdmin,
              admin_controller.get_user_profile_by_admin
            );


            
               // ADD EVENT ROUTE

               router.post(
                "/admin/add-event",
                upload.single('eventImage'),
                authForAdmin,
                admin_controller.add_events
              );
  
               // GET ALL EVENTS ROUTE

               router.get(
                "/admin/get-all-events",
                admin_controller.get_all_events
              );

                 // EDIT EVENT ROUTE

                 router.put(
                  "/admin/edit-event/:event_id",
                  upload.single('eventImage'),
                  authForAdmin,
                  admin_controller.edit_event
                );

                //GET SINGLE EVENT

                router.get(
                  "/admin/get-single-event/:event_id",
                  authForAdmin,
                  admin_controller.get_single_event
                );
    

                  //DELETE THE EVENT

                  router.delete(
                    "/admin/delete-event/:event_id",
                    authForAdmin,
                    admin_controller.delete_event
                  );


                          // ADD DATA SETS

                          router.post(
                            "/admin/add-data-sets",
                            authForAdmin,
                            admin_controller.add_data_sets
                          );
          
  
      
               // ADD PRODUCT ROUTE

               router.post(
                "/admin/add-product",
                upload.single('product_image'),
                authForAdmin,
                admin_controller.add_product
              );

              
               // GET ALL PRODUCTS

               router.get(
                "/admin/get-all-products",
                authForAdmin,
                admin_controller.get_all_products
              );

                // GET ALL PRODUCTS

                router.get(
                  "/admin/get-single-product/:product_id",
                  authForAdmin,
                  admin_controller.get_single_product
                );


               // EDIT PRODUCT

               router.put(
                "/admin/edit-product/:product_id",
                upload.single('product_image'),
                authForAdmin,
                admin_controller.edit_product
              );

               // DELETE PRODUCT

               router.delete(
                "/admin/delete-product/:product_id",
                authForAdmin,
                admin_controller.delete_product
              );

                  // RESET USER ACCOUNT

                  router.put(
                    "/admin/reset-user-account",
                    authForAdmin,
                    admin_controller.reset_user_account
                  );
    
                  // SET MERGE PRODUCT

                  router.post(
                    "/admin/set-merge-product",
                    authForAdmin,
                    admin_controller.set_merge_product
                  );


                  // SET FROZEN PRODUCT

                  router.post(
                    "/admin/set-frozen-product",
                    authForAdmin,
                    admin_controller.set_frozen_product
                  );


                  
                  // RESET FORGOT PASSWORD

                  router.put(
                    "/admin/reset-forgot-password",
                    authForAdmin,
                    admin_controller.reset_forgot_password
                  );


                    // GET ALL WITHDRAWLS REQUESTS

                    router.get(
                      "/admin/get-all-withdrawls-requests",
                      authForAdmin,
                      admin_controller.get_all_withdrawals_requests
                    );
      

                     // COMPLETE THE DEPOSIT REQUEST

                     router.post(
                      "/admin/complete-withdraw-request/:requestId",
                      authForAdmin,
                      admin_controller.complete_withdrawal_request
                    );
      
    
                     // WITHDRAW HISTORY BY ADMIN

                     router.get(
                      "/admin/get-withdraw-history-by-admin/:userId",
                      authForAdmin,
                      admin_controller.get_withdraw_history_by_admin
                    );
      
    
                     // EDIT WALLET BY ADMIN

                     router.put(
                      "/admin/edit-wallet-by-admin",
                      authForAdmin,
                      admin_controller.edit_wallet_by_admin
                    );
      
    
                     // GET WALLET BY ADMIN

                     router.get(
                      "/admin/get-wallet-by-admin/:userId",
                      authForAdmin,
                      admin_controller.get_wallet_by_admin
                    );
      
                     // GET LEVELS BY ADMIN

                     router.get(
                      "/admin/get-levels-by-admin",
                      authForAdmin,
                      admin_controller.get_levels_by_admin
                    );
      
                     // UPDATE LEVELS BY ADMIN

                     router.put(
                      "/admin/update-user-level-by-admin",
                      authForAdmin,
                      admin_controller.update_user_level_by_admin
                    );


                     // ADMIN LOGOUT

                     router.post(
                      "/admin/admin-logout",
                      authForAdmin,
                      admin_controller.admin_logout
                    );
      
    
    

              

            
  


module.exports = router