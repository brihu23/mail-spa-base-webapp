document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => {
    load_mailbox('sent'); 
  
  });
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', function() {
    console.log('clicked')
    compose_email(0)});


  // By default, load the inbox
  load_mailbox('inbox');

  //compose mail
  document.querySelector('#compose-form').onsubmit = function(event) {
    event.preventDefault();
    load_mailbox(send_mail());   
  }
});

function compose_email(id) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if (id === 0){
  console.log("hhhhh")
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
} else {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(result => {
    document.querySelector('#compose-recipients').value = `${result['sender']}`;
    document.querySelector('#compose-subject').value = `Re: ${result['subject']}`
    document.querySelector('#compose-body').value = `On ${result['timestamp']} ${result['sender']} wrote: ${result['body']} `

  })
}
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#name').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`

  document.querySelector("#content").innerHTML = '';
  api(mailbox);


  return true;
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
     fetch('/emails/sent')


     return 'sent';
    
}




function api(mailbox){
    console.log(mailbox);
    var recipients;
    var numrec;
    var id;
    fetch(`/emails/${mailbox}`) 
    .then(response => response.json())

    .then( function(emails) {

      console.log(emails, emails.length)
      if (emails.length === 0){
         const text = `You don't have any mail yet!`
         document.querySelector('#content').append(text)
      }
      console.log(emails)
      emails.forEach(populate);
        function populate(value, index){
        recipients = value["recipients"];
        numrec = recipients.length;
        id = value["id"];
        
        const econtainer = document.createElement('div');
        const element = document.createElement('div');
        const hasbeen = document.createElement('div');
        const expand = document.createElement('div');
        econtainer.className = "border border-black rounded mb-1 post"
        econtainer.setAttribute("data-id", value["id"]);
        element.innerHTML = `<p> From: ${value["sender"]} <br> To: ${value["recipients"]} <br> Subject: ${value["subject"]} <br> Time Sent: ${value["timestamp"]} </p>`
        element.data = ("id", value["id"])
        const open = document.createElement('button');;
        open.innerHTML = "Read"
        open.className = 'btn btn-primary open'
        econtainer.append(element);
        econtainer.append(expand);
        econtainer.append(hasbeen);
        econtainer.append(open);

        if (mailbox === 'inbox'){
          const archive = document.createElement('button')
          archive.innerHTML = "Archive"
          archive.className = "open btn-primary btn"
          econtainer.append(archive)
        } 

        if (mailbox === 'archive'){
          const unarchive = document.createElement('button')
          unarchive.innerHTML = "Unarchive"
          unarchive.className = "open btn btn-primary"
          econtainer.append(unarchive)

        }


        

        //console.log(id);
        

        document.querySelector('#content').append(econtainer); 

        if (mailbox === "inbox" || mailbox === 'archive') {

           fetch(`/emails/${id}`)
          .then(response => response.json())
          .then(result => {
            if (result["read"] === true){
              hasbeen.innerHTML += `You've read this email`;
              econtainer.style.backgroundColor = "lightgrey";
            }
          })

        }

        

        if (mailbox === "sent") {
          var counter = 1; 
          for (var i = 0; i < numrec; i++){
          var emailid = id + i + 1;
          var position = i;


          console.log("numrec:" ,numrec);

          fetch(`/emails/${emailid}`)
          .then(response => response.json())
          .then(result => {   

       

            if (result["read"] === true){              
           
              if (counter === 1){
                 hasbeen.innerHTML += `Email has been read by ${result["email"]}`;
                 counter++;
              } else {
                hasbeen.innerHTML += `, ${result["email"]}`;
                counter++;
              }      

              console.log("numrec:" + numrec + "counter" + counter);

              if (counter > 1){
                console.log('bii');
                econtainer.style.backgroundColor = "lightgrey";

              }
         
              
            }
          })


        }

              
        }
      }   

      if (mailbox === "sent"){
        

        expand(document.getElementsByClassName('open'), mailbox);

      } else {
        expand(document.getElementsByClassName('open '), mailbox);
      }
      

    
      
    });
}


function expand(messages, inbox) {
  console.log(messages);
  
   for (var i = 0; i < messages.length; i++){
    messages[i].addEventListener('click', function() {
      


     
      id = this.parentElement.getAttribute("data-id");
      parent = this.parentElement
      console.log(id);
      console.log(this)
      console.log(this.innerHTML);

      if (this.innerHTML === "Close"){

          this.innerHTML = "Read";          
          this.parentElement.childNodes[1].innerHTML = "";
          if (inbox === 'inbox' || inbox === 'archive'){
            this.parentElement.childNodes[2].style.display = 'block' 
            this.parentElement.style.backgroundColor = "lightgrey"
            this.parentElement.childNodes[2].innerHTML = `You've read this email <br>`   
            this.parentElement.childNodes[5].remove();
          }
          

      } 


      else if (this.innerHTML === "Read") {
                  console.log('hi');
                  fetch(`/emails/${id}`)
                    .then(response => response.json())
                    .then(result => {
                        
                        this.innerHTML = "Close";                  
                        this.parentElement.childNodes[1].innerHTML = `<p> Message: ${result["body"]} </p> `; 
                        this.parentElement.childNodes[2].style.display = 'none'    
                        console.log("user email:" + result["email"] );    
                        if (inbox === 'inbox' || inbox === 'archive'){
                          reply = document.createElement('button')
                          reply.innerHTML = "Reply"
                          reply.className = 'btn btn-primary'
                          this.parentElement.append(reply)
                          console.log(this)
                          console.log(this.parentElement)
                          reply.addEventListener('click', function() {
                            console.log("reply")
                            compose_email(id);

                          })
                        }


                        
                    })

                  if (inbox === 'inbox'){
                    console.log("PUT ID"+ id);
                    fetch(`/emails/${id}`, {                    
                      method: 'PUT',
                    body: JSON.stringify({
                    read: true        
                  }) 
                  })

                  
                          
                    

                    }
      }

      else if (this.innerHTML === "Archive") {
        console.log("boorgfnrjfk")
        fetch(`emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: true
          })
        })

        .then(result => {
          this.parentElement.style.animationPlayState = 'running';
          this.parentElement.addEventListener('animationend', function() {
            alert("email has been archived")
            parent.remove();
            
          })
          
        })
      }
      

      else if (this.innerHTML === "Unarchive") {
        console.log("hi")
        fetch(`emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
          archived: false
          })
        })

        .then(result => {
          this.parentElement.style.animationPlayState = 'running';
          this.parentElement.addEventListener('animationend', function() {
          
            parent.remove();
            alert("email has been unarchived")
            load_mailbox('inbox')
            
          })
          
        })


      }
      

    
  });
}
}