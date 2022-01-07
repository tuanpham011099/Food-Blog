# Food-Blog
Added master admin to manage all system.
<hr>
Now you can promote a user to admin or demote an admin to user
<hr>
<strong>How to create master admin<strong/>
You need to have postman, insonomia or others similar api platform
Send a post request to localhost:<yourport>/admin/create/master with password in body <br>
ex: <img src='https://res.cloudinary.com/dw6uxdli0/image/upload/v1641568617/Screenshot_1_b8rrtf.png' /> <br>
<strong>note: admin email: admin@email.com<strong/>
<strong>Version: <i>1.1.0</i></strong>
<hr>
 <hr>
Website is under development so bugs are expected.
<hr>
Some features are not function right
<hr>
Avatar upload for user will available in the next version
<hr>
Multi image upload for recipes will available in the next version
<hr>
If you need to access to admin page, you must have admin account. Follow these steps below
<ul>
  <li>1. You need to provide database connection string - I used Mongodb database</li>
  <li>2. Register an account in register page</li>
  <li>3. Access to you database</li>
  <li>4. Find your account in 'user' model</li>
  <li>5. Change field "is_admin" to true, if you dont see it, then create a new one</li>
  <li>6. Now you can go back and access admin page</li>
  <li>Good luck. If you have problem, contact me through this link: <a href='https://www.facebook.com/profile.php?id=100014043016988' target='_blank'>This is my FB</a></li>
</ul>
<strong>Version: <i>1.0.0</i></strong>
