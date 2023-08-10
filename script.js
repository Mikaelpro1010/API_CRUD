const contactTable = document.getElementById('contact-table');
const createForm = document.getElementById('create-form');
const createNameInput = document.getElementById('create-name');
const createPhoneInput = document.getElementById('create-phone');
const createEmailInput = document.getElementById('create-email');
const createActiveInput = document.getElementById('create-active');
const createBirthdateInput = document.getElementById('create-birthdate');


let newToken = ''; // Variável para armazenar o token
let contactId = ''; // Variável para armazenar o id
let createdData1 = null;

// Função para carregar os contatos existentes
function loadContacts(newToken, contactId) {
    const token = newToken;
    console.log(contactId);
    fetch(`https://api.box3.work/api/Contato/${token}`)
    .then(response => response.json())
    .then(data => {
        const contactTable = document.getElementById('contact-table'); // Obtém a referência à tabela

        // Limpa o conteúdo atual da tabela
        while (contactTable.rows.length > 1) { // A primeira linha é o cabeçalho da tabela
            contactTable.deleteRow(1);
        }

        data.forEach(contact => {
            const row = contactTable.insertRow();
            
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);
            
            cell1.innerHTML = contact.nome;
            cell2.innerHTML = contact.telefone;
            cell3.innerHTML = contact.email;
            cell4.innerHTML = contact.ativo ? 'Ativo' : 'Inativo';
            cell5.innerHTML = contact.dataNascimento;
            cell6.innerHTML = `<button onclick="editContact(${contactId}, '${token}')">Editar</button>
                               <button onclick="deleteContact(${contactId}, '${token}')">Excluir</button>
                               <button onclick="viewContact(${contactId}, '${token}')">Visualizar</button>`;
            });
    })
    .catch(error => {
        console.error('Erro ao carregar contatos:', error);
    });
}


// Função para criar um novo usuario
createForm.addEventListener('submit', event => {

    event.preventDefault();

    const newName = createNameInput.value;
    const newPhone = createPhoneInput.value;
    const newEmail = createEmailInput.value;
    const newActive = createActiveInput.value;
    const newBirthdate = createBirthdateInput.value;
    

    const newData = {
    nome: newName,
    };

    let createdData = null; // Variável para armazenar a resposta da requisição

    fetch('https://api.box3.work/api/Usuario', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
    })
    .then(response => response.json())
    .then(data => {
        createdData = data; // Armazenar a resposta na variável
        console.log('Novo contato criado:', createdData);

        // Agora você pode usar createdData aqui
        useCreatedData(createdData);
    })
    .catch(error => {
        console.error('Erro ao criar contato:', error);
    });
    
    function useCreatedData(data) {
        const token = data.token;

        const newData1 = {
            nome: newName,
            phone: newPhone,
            email: newEmail,
            active: newActive,
            birthdate: newBirthdate
        };
        
        
        console.log(token);
        fetch(`https://api.box3.work/api/Contato/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData1)
        })
        .then(response => response.json())
        .then(data1 => {
            createdData1 = data1; // Armazenar a resposta na variável
            console.log('Novo contato criado:', createdData1);

            console.log(createdData1);
            newToken = createdData1.usuario.token;
            contactId = createdData1.usuario.id;
            
            nome = createdData1.usuario.nome;
            phone = createdData1.usuario.telefone;
            email = createdData1.usuario.email;
            active = createdData1.usuario.ativo;
            birthdate = createdData1.usuario.dataNascimento;

            // <button onclick="editContact(${contactId}, '${nome}', '${phone}', '${email}', '${active}', '${birthdate}')">Editar</button>
            

            // // Chamar a função useTokenAndId passando token e id como argumentos
            // loadContacts(newToken);

            const row = contactTable.insertRow();

            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);

            cell1.innerHTML = newName;
            cell2.innerHTML = newPhone;
            cell3.innerHTML = newEmail
            cell4.innerHTML = newActive ? 'Ativo' : 'Inativo';
            cell5.innerHTML = newBirthdate;
            cell6.innerHTML = `<button onclick="editContact(${contactId}, '${token}')">Editar</button>
                                <button onclick="deleteContact(${contactId}, '${token}')">Excluir</button>
                                <button onclick="viewContact(${contactId}, '${token}')">Visualizar</button>`;

            createNameInput.value = ''; // Limpar os campos do formulário
            createPhoneInput.value = '';
            createEmailInput.value = '';
            createActiveInput.checked = false;
            createBirthdateInput.value = '';

        })
        .catch(error => {
            console.error('Erro ao criar contato:', error);
        });
        
    }
});

function viewContact(contactId, newToken) {
    const token = newToken;
    const id = contactId;
    fetch(`https://api.box3.work/api/Contato/${id}/${token}`)
      .then(response => response.json())
      .then(contact => {
        console.log(contact);
        const modal = document.getElementById('myModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
  
        // Update the modal title and body content
        modalTitle.textContent = `Detalhes do Contato - ${contact.nome}`;
        modalBody.innerHTML = `
          <p><strong>Nome:</strong> ${contact.nome}</p>
          <p><strong>Telefone:</strong> ${contact.telefone}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Status:</strong> ${contact.ativo ? 'Ativo' : 'Inativo'}</p>
          <p><strong>Data de Nascimento:</strong> ${contact.dataNascimento}</p>
        `;
  
        // Show the modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      })
      .catch(error => {
        console.error('Error while viewing contact:', error);
      });
  }

// Função para excluir um contato
function deleteContact(newToken, contactId) {
    const confirmation = confirm("Tem certeza que deseja excluir este contato?");
    
    if (!confirmation) {
        return; // Cancela a exclusão se o usuário não confirmar
    }
    
    fetch(`https://api.box3.work/api/Contato/${newToken}/${contactId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Contato excluído:', data);

        // Remova a linha correspondente da tabela
        const rowIndex = findRowIndex(contactId);
        if (rowIndex !== -1) {
            contactTable.deleteRow(rowIndex);
        }
    })
    .catch(error => {
        console.error('Erro ao excluir contato:', error);
    });
}

// Função auxiliar para encontrar o índice da linha com base no ID do contato
function findRowIndex(contactId) {
    for (let i = 1; i < contactTable.rows.length; i++) {
        const cell = contactTable.rows[i].cells[5]; // A última célula com os botões de ação
        const editButton = cell.querySelector(`button[onclick*="editContact(${contactId})"]`);
        const deleteButton = cell.querySelector(`button[onclick*="deleteContact(${contactId})"]`);
        
        if (deleteButton) {
            return i;
        }
    }
    
    return -1; // Retorna -1 se o contato não for encontrado
}

// Função para editar um contato
function editContact(contactId, newToken) {
    const token = newToken;

    // Obter os dados atuais do contato para preencher o modal de edição
    fetch(`https://api.box3.work/api/Contato/${contactId}/${token}`)
      .then(response => response.json())
      .then(contact => {
        console.log(contact);

        // Preencher os campos do modal de edição
        const editNameInput = document.getElementById('edit-name');
        const editPhoneInput = document.getElementById('edit-phone');
        const editEmailInput = document.getElementById('edit-email');

        editNameInput.value = contact.nome;
        editPhoneInput.value = contact.telefone;
        editEmailInput.value = contact.email;

        // Mostrar o modal de edição
        $('#editModal').modal('show');

        // Lidar com o clique no botão "Salvar Alterações"
        const saveChangesButton = document.getElementById('save-changes');
        saveChangesButton.addEventListener('click', () => {
            const updatedName = editNameInput.value;
            const updatedPhone = editPhoneInput.value;
            const updatedEmail = editEmailInput.value;

            // Criar o objeto de dados atualizados
            const updatedData = {
                nome: updatedName,
                telefone: updatedPhone,
                email: updatedEmail
            };

            // Enviar os dados atualizados para a API
            fetch(`https://api.box3.work/api/Contato/${contactId}/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Contato atualizado:', data);
                // Atualizar a tabela ou fazer outras ações necessárias
                // ...

                // Fechar o modal de edição
                $('#editModal').modal('hide');
            })
            .catch(error => {
                console.error('Erro ao atualizar contato:', error);
            });
        });
    })
    .catch(error => {
        console.error('Error while viewing contact:', error);
    });
}


  


// // Função para editar um contato
// function editContact(contactId) {
//   console.log('Editar contato com ID:', contactId);
//   // Implemente a lógica de edição aqui
// }

// // Função para excluir um contato
// function deleteContact(contactId) {
//   console.log('Excluir contato com ID:', contactId);
//   // Implemente a lógica de exclusão aqui
// }

// // Carregar a lista de contatos inicialmente