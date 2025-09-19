    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc }
        from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


    const firebaseConfig = {
        apiKey: "AIzaSyBGfegTxLvnp-N7JEOw2jDBmoyPosyhHtw",
        authDomain: "star-7446c.firebaseapp.com",
        projectId: "star-7446c",
        storageBucket: "star-7446c.firebasestorage.app",
        messagingSenderId: "1079272879847",
        appId: "1:1079272879847:web:ba1ece1db93d86a23cd442",
        measurementId: "G-8YSV40VRT1"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const usersList = document.getElementById("usersList");
    let currentId = null;
    let allUsers = [];

    // Add User
    window.addUser = async function () {
        try {
            const fullname = document.getElementById("fullname").value;
            const age = document.getElementById("age").value;
            const gmail = document.getElementById("gmail").value;
            const password = document.getElementById("password").value;

            await addDoc(collection(db, 'users'), {
                fullname,
                age: parseInt(age),
                gmail,
                password
            });
            alert("✅ User Added");
            getUsers();
        } catch (error) {
            console.error("❌ Error adding user:", error);
        }
    };

    // Get Users
    window.getUsers = async function () {
        try {
            const snapshot = await getDocs(collection(db, 'users'));
            allUsers = [];
            snapshot.forEach((val) => {
                allUsers.push({ id: val.id, ...val.data() });
            });
            renderUsers(allUsers);
        } catch (error) {
            console.error("❌ Error getting users:", error);
        }
    };

    // Render Users
    function renderUsers(data) {
        usersList.innerHTML = "";
        data.forEach((userData) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p><b>${userData.fullname}</b></p>
                <p>Age: ${userData.age}</p>
                <p>Email: ${userData.gmail}</p>
                <p>Password: ${userData.password}</p>
                <button onclick="updateUser('${userData.id}')">Update</button>
                <button onclick="deleteUser('${userData.id}')">Delete</button>
            `;
            usersList.appendChild(li);
        });
    }

    // Search
    document.querySelector('#search').addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filtered = allUsers.filter(user =>
            user.fullname.toLowerCase().includes(searchValue)
        );
        renderUsers(filtered);
    });

    // Update User
    window.updateUser = function (id) {
        currentId = id;
        document.querySelector(".pop-up").style.display = "block";
    };

    window.newUpdateUser = async function () {
        try {
            const newFullname = document.getElementById("new-fullname").value;
            const newAge = document.getElementById("new-age").value;
            const newEmail = document.getElementById("new-gmail").value;
            const newPassword = document.getElementById("new-password").value;

            const userRef = doc(db, "users", currentId);
            await updateDoc(userRef, {
                fullname: newFullname,
                age: parseInt(newAge),
                gmail: newEmail,
                password: newPassword
            });

            alert("✅ User updated");
            closePopup();
            getUsers();
        } catch (error) {
            console.error("❌ Error updating user:", error);
        }
    };

    // Delete User
    window.deleteUser = async function (id) {
        await deleteDoc(doc(db, "users", id));
        alert("User deleted");
        getUsers();
    };

    // Close Popup
    window.closePopup = function () {
        document.querySelector(".pop-up").style.display = "none";
    };