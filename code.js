$(document).ready(function() {

    // Un clic sur le bouton "oui" affiche le formulaire de recherche du nom d'un infirmier et cache le reste
    $( ".oui" ).on( "click", function() {
        $( ".connu" ).transition('fade')
        $( ".chercher, .accueil" ).hide();

    });
    // Un clic sur le bouton "oui" affiche le formulaire de recherche général d'un infirmier et cache le reste
    $( ".non" ).on( "click", function() {
        $( ".chercher" ).transition('fade');
        $( ".connu, .accueil" ).hide();
    });

// Initialise le formulaire
  $(".ui.dropdown").dropdown();
  $(".ui.radio.checkbox").checkbox();

  // Infirmiers
  var contenu = [
    {
      name: "Hélène Dubois",
      female: true,
      counties: [75, 78, 92],
      knowHows: ["piqures", "pansements"],
      picture: "helene.png"
    },
    {
      name: "Hugo Dupont",
      female: false,
      counties: [77],
      knowHows: ["pansements", "piqures", "perfusions"],
      picture: "hugo.png"
    },
    {
      name: "Hubert Durand",
      female: false,
      counties: [78, 93, 75, 94, 95],
      knowHows: ["perfusions", "pansements", "aérosol"],
      picture: "hubert.png"
    },
    {
      name: "Alexandra Dupuis",
      female: true,
      counties: [75, 94, 95],
      knowHows: ["piqures", "pansements", "aérosol"],
      picture: "alexandra.png"
    }
  ];

  // Dans le tableau contenu, change le nom de la propriété "name" en "title" pour que Semantic UI puisse afficher les noms des infirmiers
  for (var i = 0; i < contenu.length; i++) {
    contenu[i].title = contenu[i].name;
    delete contenu[i].name;
  }
  // Recherche en autocompletion un infirmier dans la tableau contenu
  $(".ui.search").search({
    source: contenu
  });

  $(".ui.inverted.pink.button.rdv").on("click", function() {
    // la variable infirmier prend la valeur de l'input avec l'id "infirmier"
    var infirmier = $("#infirmier").val();
    // Vérifie si l'infirmier demandé existe bien dans le tableau contenu, si oui la variable sera true, et false si aucun infirmier n'est trouvé
    var verification = contenu.some(contenu => contenu["title"] === infirmier);
    console.log(verification);
    if (verification == false) {
      // Si il n'y a pas d'infirmier trouvé, la modale d'erreur s'affiche
      $(".ui.modal.erreur").modal("show");
    } else {
      // Si un infirmier est bien trouvé la modale de confirmation avec le nom de l'infirmier s'affiche
      $(".resultat").html(infirmier);
      $(".ui.modal.ok").modal("show");
    }
  });


  $('.ui.form.chercher')
  .form({
      // Verification des champs du formulaire, si l'un d'entre eux n'est pas correct un message apparaitra et le background du champ sera rouge
    fields: {
      codepostal: {
        identifier: 'codepostal',
        rules: [
          {
            type   : 'empty',
            prompt : 'Merci d\'entrer votre code postal'
          },
          {
            type   : 'exactLength[5]',
            prompt : 'Merci d\'entrer un code postal valide'
          }
        ]
      },
      soins: {
        identifier: 'soins',
        rules: [
            {
                type   : 'empty',
                prompt : 'Merci de choisir au moins une catégorie de soins'
              },
          {
            type   : 'maxCount[3]',
            prompt : 'Merci de choisir au maximum 3 soins'
          }
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Merci d\'entrer votre adresse e-mail'
          },
          {
            type   : 'email',
            prompt : 'Merci d\'entrer une adresse e-mail valide.'
          }
        ]
      },
    },
    // Si le formulaire est correct, une suite d'instructions se lance
    onSuccess:function(){
        // Récupération des valeurs de préférence de genre et de soins nécessaires pour le patient
        let genre = $('#preference').find('[name="genre"]:checked').val();
        let soins = $('.ui.dropdown').dropdown('get value');
        // Conversion du résultat de la préférence de genre d'un string à un booléen
        var genre_verif = checkBoolean(genre);
        // Initialisation du compteur, tant qu'il reste à zéro l'infirmier conviendra au patient
        var compteur = 0;
        // Initialisation du contenu de la modale d'affichage des profils d'infirmiers
        var modale = "";
        // Boucle for pour parcourir le tableau d'infirmiers
        for (var i = 0; i < contenu.length; i++) {
            // Réinitialisation du compteur à chaque boucle (pour chaque infirmier)
            compteur = 0;
            // Vérification du genre par une condition
            if (contenu[i].female == genre_verif){
                    // Deuxième boucle for pour comparer chaque type de soin demandé aux compétences des infirmiers 
                    for (var y = 0; y < soins.length; y++) {
                        // Si un soin n'est pas proposé par un infirmier
                        if (contenu[i].knowHows.includes(soins[y]) == false){
                            // Le compteur passe au dessus de zéro
                            compteur++;
                        }
                    }
                    // On ne garde ici donc que les infirmiers qui conviennent au patient
                    if (compteur == 0){
                        // Le code html présentant chaque infirmier est ajouté à la variable modale
                        modale = modale +(`
                        <div class="item">
                            <div class="ui small circular image">
                                <img src="images/`+ contenu[i].picture + `">
                            </div>
                            <div class="middle aligned content">
                                <h2 class="ui pink header">`+ contenu[i].title + `</h2>
                            </div>
                        </div>
                    `)
                    }
            }
            
          }
        // Si la variable modale contient quelque chose (une liste d'infirmiers donc)
        if (modale){
        // La variable modale est injectée sur la page html dans la moale prévue
        $(".ui.items").html(modale);
        // Et elle est affichée
        $(".ui.basic.modal.liste").modal("show");
        } else {
            // Si la variable modale est vide, la modale d'indisponibilité d'infirmiers s'affiche
            $(".ui.modal.indisponible").modal("show");
        }
        // Permet d'éviter un rafraichissement automatique de la page à cause du formulaire
        return false;
    }
  }
    
    
   
   );

    // Fonction de conversion string vers booléen
   function checkBoolean(value){
    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }
   }
});
