var MineSweeper = (function() {
    const grid = document.querySelector(".grid");
    const generate_Button = document.getElementById("gen_btn");

    let rows,
        col,
        safeCells,
        cellsClicked = 0,
        bombs = [],
        data = [];

    function _start() {

        generate_Button.addEventListener("click", _init);
    }


    function _init() {
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        let row_inp = document.getElementById("rows");
        let col_inp = document.getElementById("cols");
        rows = parseInt(row_inp.value.trim(""));
        col = parseInt(col_inp.value.trim(""));

        _setupModel();
        _createUIFromModel();
    }

    function _setupModel() {
        data = [];
        for (let i = 0; i < rows; i++) {
            data.push([]);
            for (let j = 0; j < col; j++) {

                data[i].push({
                    id: `${i}-${j}`,
                    row: i,
                    col: j,
                    bomb: false,
                    visible: false
                });
            }
        }

        _addBombs();
    }


    function _addBombs() {
        let dictionary = {};
        let bombCount = Math.floor(rows * col * 0.25);
        while (Object.keys(dictionary).length < bombCount) {
            x = Math.floor(Math.random() * 1000) % rows;
            y = Math.floor(Math.random() * 1000) % col;
            dictionary["" + x + "-" + y] = [x, y];
        }

        bombs = Object.keys(dictionary).map(k => dictionary[k]);
        safeCells = rows * col - bombCount;
        bombs.map(item => {
            data[item[0]][item[1]].bomb = true;
        });
    }


    function _createUIFromModel() {
        let fragment = document.createDocumentFragment();
        grid.style.height = `${rows * 50}px`;
        grid.style.width = `${col * 50}px`;
        data.map(item => {
            for (let j = 0; j < item.length; j++) {
                let square = document.createElement("div");
                square.setAttribute("id", `${item[j].row}-${item[j].col}`);
                square.setAttribute("row", item[j].row);
                square.setAttribute("col", item[j].col);
                square.addEventListener("click", _cellClick);
                fragment.appendChild(square);
            }
        });
        grid.appendChild(fragment);
    }


    function _cellClick(e) {
        let selectedRow = e.target.getAttribute("row");
        let selectedCol = e.target.getAttribute("col");
        let selectedItem = data[selectedRow][selectedCol];
        let count = _getNeighborsWithBombCount(selectedItem);
        cellsClicked++;
        e.target.className = "alreadyClicked";
        if (selectedItem.bomb) {
            _showModal(
                "Ti Humbe Lojen.<br/><button onclick='javascript:window.location.reload()'>Luaj Perseri</button>",
                "loser"
            );
            _revealBombs();
            return;
        } else if (cellsClicked === safeCells) {
            _showModal(
                "Ti e Fitove Lojen.<br/><button onclick='javascript:window.location.reload()'>Luaj Perseri</button>",
                "winner"
            );
            _revealBombs();
            return;
        } else {
            e.target.innerHTML = `<span class='color${count} digit'>${count}</span>`;
        }
    }


    function _getNeighborsWithBombCount(cell) {

        let dx = [-1, -1, -1, 0, 0, 1, 1, 1];
        let dy = [-1, 0, 1, -1, 1, -1, 0, 1];
        let r = cell.row;
        let c = cell.col;
        let count = 0;

        for (let j = 0; j < 8; j++) {
            if (_isValid(r + dx[j], c + dy[j]) && data[r + dx[j]][c + dy[j]].bomb) {
                count++;
            }
        }
        return count;
    }

    function _isValid(x, y) {
        if (x < 0 || x >= rows || y < 0 || y >= col) return false;
        return true;
    }

    function _showModal(txt, cls) {
        modal = document.getElementById("myModal");
        ele = document.getElementById("modal-data");
        modal.style.display = "block";
        ele.style.display = "block";
        ele.innerHTML = txt;
        ele.classList.add(cls);
    }

    function _revealBombs() {
        bombs.map(item => {
            let bombEle = document.getElementById(`${item[0] + "-" + item[1]}`);
            _appendImage(bombEle);
        });
    }

    function _appendImage(ele) {
        let image = document.createElement("img");
        image.className = "bomb";
        image.src = "bomb.jpg";
        ele.appendChild(image);
        ele.className = "bomb";
    }

    return {
        start: function() {
            _start();
        }
    };
})();

MineSweeper.start();
