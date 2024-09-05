document.addEventListener('DOMContentLoaded', () => {
    // Get the game container and message container elements from the HTML
    const gameContainer = document.getElementById('game-container');
    const messageContainer = document.getElementById('message-container');
    // Initialize game variables
    let currentPlayer = 'X'; // Represents the current player, starting with 'X'
    // Represents the Tic Tac Toe game board
    let gameBoard = ['', '', '', '', '', '', '', '', '']; 
    let gameActive = true; // Indicates whether the game is still active
    // Create the Tic Tac Toe game grid by adding cells to the game container
    for(let i = 0; i < 9; i++) {
        // Create a new div element for each cell
        const cell = document.createElement('div'); 
        cell.classList.add('cell'); // Add the 'cell' class to the cell div
        // Add a click event listener to each cell
        cell.addEventListener('click', () => handleCellClick(i));
        gameContainer.appendChild(cell); // Append the cell to the game container
    }

    // Function to handle a click on a cell in the Tic Tac Toe grid
    function handleCellClick(index) {
        // Check if the game is not active or the clicked cell is already occupied
        if(!gameActive || gameBoard[index] !== '') return;
        // Human player's turn
        currentPlayer = 'X'; // Set the current player to 'X'
        // Make a move in the clicked cell for the human player
        makeMove(index, currentPlayer); 
        // Check for a winner or draw after the human player's move
        if(checkWinner()) {
            // Display the winner (Human or Computer) and end the game
            displayWinner(`${currentPlayer === 'X' ? 'Human' : 'Computer'} wins!`);
            gameActive = false;
        } else if(gameBoard.every(cell => cell !== '')) {
            // If no winner and the board is full, it's a draw
            displayWinner("It's a draw!");
            gameActive = false;
        } else {
            // If the game is still active, initiate the 
            // Computer player's turn after a delay
            setTimeout(() => computerMove(), 500);
        }
    }

    // Function to make a move in the Tic Tac Toe game
    function makeMove(index, player) {
        // Set the player's symbol in the game board
        gameBoard[index] = player;
        // Create an image element for 'X' or 'O'
        const img = document.createElement('img');
        img.src = player === 'X' ? 'images/X.png' : 'images/O.png';
        // Append the image to the clicked cell in the game container
        gameContainer.children[index].appendChild(img);
    }

    // Function to handle the computer's move in the Tic Tac Toe game
    function computerMove() {
        // Set the current player to 'O' (Computer's turn)
        currentPlayer = 'O';
        // Check for a winning move for the computer
        let winningMove = findWinningMove(currentPlayer);
        // If a winning move is available, make the move
        if(winningMove !== -1) {
            makeMove(winningMove, currentPlayer);
        } else {
            // Check for a blocking move to prevent the human player from winning
            let blockingMove = findWinningMove('X');
            // If a blocking move is available, make the move
            if(blockingMove !== -1) {
                makeMove(blockingMove, currentPlayer);
            } else {
                // If no winning or blocking moves, choose a random empty position
                let emptyPositions = gameBoard.reduce((acc, val, index) => {
                    if(val === '') acc.push(index);
                    return acc;
                }, []);
                let randomIndex = Math.floor(Math.random() * emptyPositions.length);
                let randomMove = emptyPositions[randomIndex];
                makeMove(randomMove, currentPlayer);
            }
        }
        // Check for a winner or draw after the computer's move
        if(checkWinner()) {
            // Display the winner (Human or Computer) and end the game
            displayWinner(`${currentPlayer === 'X' ? 'Human' : 'Computer'} wins!`);
            gameActive = false;
        } else if(gameBoard.every(cell => cell !== '')) {
            // If no winner and the board is full, it's a draw
            displayWinner("It's a draw!");
            gameActive = false;
        } else {
            // Switch back to the human player after the computer's move
            currentPlayer = 'X';
        }
    }
    // Function to find a winning move for the given player
    function findWinningMove(player) {
        // Define winning patterns for rows, columns, and diagonals
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6] // Diagonals
        ];
        // Iterate through each winning pattern
        for(const pattern of winPatterns) {
            // Count the number of occurrences 
            // of the player's symbol in the pattern
            const count = pattern.reduce((acc, index) => (gameBoard[index] === player ? acc + 1 : acc), 0);
            // If there are two occurrences (2 out of 3),
            // find the empty index for a winning move
            if(count === 2) {
                const emptyIndex = pattern.find(index => gameBoard[index] === '');
                // If an empty index is found, return it as the winning move
                if(emptyIndex !== undefined) {
                    return emptyIndex;
                }
            }
        }
        // If no winning move is found, return -1
        return -1;
    }
    // Function to check if the current player has won the game
    function checkWinner() {
        // Define winning patterns for rows, columns, and diagonals
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6] // Diagonals
        ];
        // Check if any of the winning patterns are
        // satisfied by the current player's moves
        return winPatterns.some(pattern =>
            // Check if every index in the pattern 
            // is filled with the current player's symbol
            pattern.every(index => gameBoard[index] === currentPlayer));
    }
    // Function to display the winner message and "New Game" button
    function displayWinner(message) {
        // Set the inner HTML of the message container
        // with the winner message and a "New Game" button
        messageContainer.innerHTML = `<p>${message}</p><button id="newGameButton">New Game</button>`;
        // Show the "New Game" button by changing its display style to 'block'
        document.getElementById('newGameButton').style.display = 'block';
        // Add an event listener for the "New Game" button to handle the click event
        document.getElementById('newGameButton').addEventListener('click', newGame);
    }
    // Event listener for the "New Game" button
    function newGame() {
        // Reset game variables
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        // Clear the inner HTML of the message container
        messageContainer.innerHTML = '';
        // Clear the game board
        for(let i = 0; i < 9; i++) {
            const cell = gameContainer.children[i];
            // Clear text content of the cell
            cell.textContent = '';
            // Remove images from cells
            while(cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
        }
        // Start a new game, and if the computer 
        // is the first player, delay its move
        if(currentPlayer === 'O') {
            setTimeout(() => computerMove(), 500);
        }
    }
});
