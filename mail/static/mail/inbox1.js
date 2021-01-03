

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox', 0));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent', 0));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive', 0));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox', 0);


  //send email and go to send mailbox

  
  document.querySelector('#compose-form').onsubmit = function(event) {
    event.preventDefault();
    load_mailbox(send_mail(),0);   
  }


  messages = document.getElementsByClassName("open");
  for (var i = 0; i < messages.length; i++){
    messages[i].addEventListener('click', function() {

      id = this.parentElement.data("id")
      fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(result => {
          console.log("Expand button clicked")
          console.log(result);
          this.parentElement.innerHTML += `<p> Message: ${result["body"]} </p> `
      })

    })
  }
  function expand() {
  var messages = document.getElementsByClassName('open');
  console.log(messages); 
  console.log(messages.length);
  console.log(messages.item(0));
  messages[0].addEventListener('click', function() {
    console.log("boooo");
  });
   for (var i = 0; i < messages.length; i++){
    messages[i].addEventListener('click', function() {
      console.log("hi");

      id = this.parentElement.getAttribute("id");
      console.log(id);
      fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(result => {
          console.log("Expand button clicked")
          console.log(result);
          this.parentElement.innerHTML += `<p> Message: ${result["body"]} </p> `
      })

    })
  }
}




});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  


}

function load_mailbox(mailbox, load) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#name').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //sent mailbox

  if (mailbox === 'sent' && load === 0) {

    document.querySelector("#content").innerHTML = '';
    

    fetch('/emails/sent') 
    .then(response => response.json())

    .then(emails => {
      console.log(emails)
      emails.forEach(populate);
      function populate(value, index){
        const econtainer = document.createElement('div');
        const element = document.createElement('div');

        econtainer.className = "border border-black rounded mb-1"
        element.innerHTML = `<p> From: ${value["sender"]} <br> To: ${value["recipients"]} <br> Subject: ${value["subject"]} <br> Time Sent: ${value["timestamp"]} </p>`
        element.data = ("id", value["id"])
        const open = document.createElement('button');;
        open.innerHTML = "Expand"
        open.className = 'btn btn-primary open'
        econtainer.append(element);
        econtainer.append(open);


        
          open.addEventListener('click', function() {

          if (open.innerHTML === "Expand") {
          console.log("element has been clicked boog");
          this.innerHTML = "Close";
          open.parentElement.childNodes[0].innerHTML += `<p> Message: ${value["body"]} </p>`;

        } else {
          open.addEventListener('click', function() {
          console.log("element has been clicked boo");
          this.innerHTML "Expand";
          open.parentElement.childNodes[0].innerHTML = `<p> From: ${value["sender"]} <br> To: ${value["recipients"]} <br> Subject: ${value["subject"]} <br> Time Sent: ${value["timestamp"]} </p>`;
          });
        }
      });
        
        document.querySelector('#content').append(econtainer);
      }

    })  
    

  }
}


function send_mail(){
    const recip = document.querySelector('#compose-recipients').value;
    const subjec = document.querySelector('#compose-subject').value ;
    const bod = document.querySelector('#compose-body').value ;
     
    
     fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recip,
        subject: subjec,
        body: bod

      })

     })

     .then(response => response.json())
     .then(result => {
          // Print result
          console.log(result);
       
       });  
     fetch('/emails/sent') 


     return 'sent';


    
}



 
