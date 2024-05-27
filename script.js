'use strict'

window.addEventListener('DOMContentLoaded', () => {

    const randm = (n) => {

        Math.seedrandom(3220);

        let matrix = [];

        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                let randomNumber = Math.random() * 2.0;
                row.push(randomNumber);
            }
            matrix.push(row);
        }

        return matrix;
    };

    const mulmr = (matrix, k) => {

        const result = [];

        for (let i = 0; i < matrix.length; i++) {
            let row = [];
            for (let j = 0; j < matrix[i].length; j++) {
                row.push(matrix[i][j] * k);
                row[j] = row[j] < 1 ? 0 : 1;
            }
            result.push(row);
        }

        return result;
    };

    const printMatrix = (matrix) => {

        let result = "";
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                result += matrix[i][j] + " ";
            }
            console.log(result);
            result = "";
        }
    };

    const n1 = 3, n2 = 2, n3 = 2, n4 = 0;
    const n = 10 + n3;
    const k = 1.0 - n3 * 0.01 - n4 * 0.005 - 0.15;

    let randomMatrix = randm(n);

    let matrixOr = mulmr(randomMatrix, k); //матриця суміжності орієнтованого графа
    console.log('Adjacency matrix for oriented graph: ');
    printMatrix(matrixOr);


    const RADIUS_OF_GRAPH = 200;
    const GRAPH_CENTER_X = 300;
    const GRAPH_CENTER_Y = 300;
    const RADIUS = 20;

    class Point {
        constructor(x, y, index) {
            this.x = x;
            this.y = y;
            this.index = index;
            this.isActive = false;
            this.isClosed = false;
            this.isVisited = false;
        }
    }

    const getArrayOfVertices = () => {
        const vertices = [];
        for (let i = 0; i < n; i++) {
            const angle = Math.PI - Math.PI / 6 * i;
            const x = RADIUS_OF_GRAPH * Math.cos(angle) + GRAPH_CENTER_X;
            const y = RADIUS_OF_GRAPH * Math.sin(angle) + GRAPH_CENTER_Y;
            const vertex = new Point(x, y, i);
            vertices.push(vertex);
        }
        return vertices;
    };
    const ARRAY_VERTICES = getArrayOfVertices();

    const getVertex = (index) => {
        for (let i = 0; i < ARRAY_VERTICES.length; i++) {
            if (i === index) {
                const vertex = new Point(ARRAY_VERTICES[i].x, ARRAY_VERTICES[i].y, i);
                return vertex;
            }
        }
    };

    const fillVertex = (point1, point2, context) => {
        //if (point1.index !== -1) {
        context.beginPath();
        context.arc(point1.x, point1.y, RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
        context.fillStyle = 'white';
        context.fill();
        context.font = "14px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(point1.index + 1, point1.x, point1.y);
        //}
        //if (point2.index !== -1) {
        context.beginPath();
        context.arc(point2.x, point2.y, RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
        context.fillStyle = 'white';
        context.fill();
        context.font = "14px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(point2.index + 1, point2.x, point2.y);
        //}
    };

    const drawLoop = (point, context, isOriented) => {
        const angle = Math.PI + point.index * Math.PI / 6;
        let x1 = point.x + 2 * RADIUS * Math.cos(angle);
        let y1 = point.y - 2 * RADIUS * Math.sin(angle);
        const newPoint = new Point(x1, y1, point.index);
        context.beginPath();
        context.arc(x1, y1, RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
        if (isOriented) drawArrowheadLoop(newPoint, context);
    };
    const drawArrowheadLoop = (point, context) => {

        const Agl = Math.PI / 8 - point.index * (Math.PI / 6);
        const x2 = point.x + RADIUS * Math.cos(Agl);
        const y2 = point.y + RADIUS * Math.sin(Agl);
        context.beginPath();
        context.moveTo(x2, y2);
        context.lineTo(x2 + 10 * Math.cos(Agl + Math.PI / 3), y2 + 10 * Math.sin(Agl + Math.PI / 3)); // right
        context.moveTo(x2, y2);
        context.lineTo(x2 - 10 * Math.cos(Agl - Math.PI / 4), y2 - 10 * Math.sin(Agl - Math.PI / 4)); // left
        context.stroke();
    };

    const drawEdge = (point1, point2, context) => {
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.stroke();
        fillVertex(point1, point2, context);
    };
    const drawArrowheadForEdges = (point1, point2, context) => {
        const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        let Agl;
        if (point2.y >= point1.y) {
            Agl = angle;
            const x2 = point2.x - RADIUS * Math.cos(Agl);
            const y2 = point2.y - RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl - Math.PI / 6), y2 - 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl + Math.PI / 6), y2 - 10 * Math.sin(Agl + Math.PI / 6));
            context.stroke();
        } else {
            Agl = angle + Math.PI;
            const x2 = point2.x + RADIUS * Math.cos(Agl);
            const y2 = point2.y + RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl - Math.PI / 6), y2 + 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl + Math.PI / 6), y2 + 10 * Math.sin(Agl + Math.PI / 6));
            context.stroke();
        }
    };

    const drawArc = (point1, point2, context) => {
        const angle = Math.atan((point2.y - point1.y) / (point2.x - point1.x));
        let x0 = RADIUS * Math.cos((Math.PI / 2 - angle));
        let y0 = RADIUS * Math.sin((Math.PI / 2 - angle));
        let x;
        let y;
        if (point1.y > 300 && point2.x <= 300 || point1.y <= 300 && point2.x > 300) {
            if (point2.x < 300 && point2.y >= 300 && point1.x < 300 && point1.y >= 300 && point1.y !== 600) {
                x = (point1.x + point2.x) / 2 - 4 * x0;
                y = (point1.y + point2.y) / 2 + 4 * y0;
            } else {
                x = (point1.x + point2.x) / 2 - 2 * x0;
                y = (point1.y + point2.y) / 2 + 2 * y0;
            }
        } else {
            x = (point1.x + point2.x) / 2 + 2 * x0;
            y = (point1.y + point2.y) / 2 - 2 * y0;
        }
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(x, y);
        context.lineTo(point2.x, point2.y);
        context.stroke();
        const medium = new Point(x, y, 12);
        fillVertex(point1, point2, context);
        drawArrowheadArcs(medium, point2, context);
    };
    const drawArrowheadArcs = (point0, point2, context) => {
        const angle = Math.atan2(point2.y - point0.y, point2.x - point0.x);
        let Agl;
        if (point2.y >= point0.y) {
            Agl = angle;
            const x2 = point2.x - RADIUS * Math.cos(Agl);
            const y2 = point2.y - RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl - Math.PI / 6), y2 - 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl + Math.PI / 6), y2 - 10 * Math.sin(Agl + Math.PI / 6));
            context.stroke();
        } else {
            Agl = angle + Math.PI;
            const x2 = point2.x + RADIUS * Math.cos(Agl);
            const y2 = point2.y + RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl - Math.PI / 6), y2 + 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl + Math.PI / 6), y2 + 10 * Math.sin(Agl + Math.PI / 6));
            context.stroke();
        }
    };

    const drawOrientedGraph = () => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        const isOriented = true;
        let index = 0;
        const drawVertex = () => {
            const vertex = getVertex(index);
            context.fillStyle = "white";
            context.beginPath();
            context.arc(vertex.x, vertex.y, RADIUS, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();
            index++;
            context.font = "14px Arial";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(index, vertex.x, vertex.y);
            if (index === n) {
                clearInterval(interval_id);
            }
            if (index === n) { // Check if all vertices are drawn
                let j = 0;
                let i = 0;
                const interval_ID = setInterval(() => {
                    const vertex1 = getVertex(i);
                    const vertex2 = getVertex(j);
                    if (i === j && matrixOr[i][j]) {
                        drawLoop(vertex1, context, isOriented);
                        j++;
                    } else if (i < j && matrixOr[i][j]) {
                        drawEdge(vertex1, vertex2, context);
                        drawArrowheadForEdges(vertex1, vertex2, context);
                        j++;
                    } else if (matrixOr[i][j] && matrixOr[j][i]) {
                        drawArc(vertex1, vertex2, context, isOriented);
                        j++;
                    } else if (matrixOr[i][j] && i > j) {
                        drawEdge(vertex1, vertex2, context);
                        drawArrowheadForEdges(vertex1, vertex2, context);
                        j++;
                    } else j++;
                    if (j === n) {
                        i++;
                        j = 0;
                    }
                    if (i === n) {
                        clearInterval(interval_ID);
                    }
                }, 1);
            }
        };
        const interval_id = setInterval(drawVertex, 1);
        return context;
    };
    let ctx = drawOrientedGraph();

    //______________________________________________________________________________________________________________

    const BFSbutton = document.querySelector("#BFSbutton");
    const DFSbutton = document.querySelector("#DFSbutton");
    const resetButton = document.querySelector('#resetButton');

    resetButton.addEventListener('click', () => {
        location.reload();
    })

    class Queue {
        constructor() {
            this.items = [];
        }

        isEmpty() {
            return this.items.length === 0;
        }

        addElement(element) {
            this.items.push(element);
        }

        delElement() {
            if (!this.isEmpty()) this.items.shift();
            else {
                console.log('the queue is empty, there is nothing to delete');
                return null;
            }
        }

        getFirst() {
            return this.items[0];
        }

        getLast() {
            return this.items.at(-1);
        }

    }

    class Stack {
        constructor() {
            this.items = [];
        }

        isEmpty() {
            return this.items.length === 0;
        }

        addElement(element) {
            this.items.push(element);
        }

        delElement() {
            if (!this.isEmpty()) this.items.pop();
            else return null;
        }

        getLast() {
            return this.items.at(-1);
        }
    }

    class Index {
        constructor() {
            this.index = 0;
        }
    }

    const paintVertex = (point1, context) => {

        if (point1.isActive || point1.isClosed || point1.isVisited) {

            context.beginPath();
            context.arc(point1.x, point1.y, RADIUS, 0, 2 * Math.PI, true);
            context.stroke();
            if (point1.isActive) {
                context.fillStyle = 'red';
            } else if (point1.isClosed) {
                context.fillStyle = 'darkblue';
            } else {
                context.fillStyle = 'darkorange';
            }
            context.fill();
            context.font = "14px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(point1.index + 1, point1.x, point1.y);
        } else {
            context.beginPath();
            context.arc(point1.x, point1.y, RADIUS, 0, 2 * Math.PI, true);
            context.stroke();
            context.fillStyle = 'white';
            context.fill();
            context.font = "14px Arial";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(point1.index + 1, point1.x, point1.y);
        }
    };

    const paintLoop = (point, context) => {
        const angle = Math.PI + point.index * Math.PI / 6;
        let x1 = point.x + 2 * RADIUS * Math.cos(angle);
        let y1 = point.y - 2 * RADIUS * Math.sin(angle);
        const newPoint = new Point(x1, y1, point.index);
        context.beginPath();
        context.arc(x1, y1, RADIUS, 0, 2 * Math.PI, true);
        context.strokeStyle = 'green';
        context.lineWidth = 3;
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        paintArrowheadLoop(newPoint, context);
    };
    const paintArrowheadLoop = (point, context) => {

        const Agl = Math.PI / 8 - point.index * (Math.PI / 6);
        const x2 = point.x + RADIUS * Math.cos(Agl);
        const y2 = point.y + RADIUS * Math.sin(Agl);
        context.beginPath();
        context.moveTo(x2, y2);
        context.lineTo(x2 + 10 * Math.cos(Agl + Math.PI / 3), y2 + 10 * Math.sin(Agl + Math.PI / 3)); // right
        context.moveTo(x2, y2);
        context.lineTo(x2 - 10 * Math.cos(Agl - Math.PI / 4), y2 - 10 * Math.sin(Agl - Math.PI / 4)); // left
        context.strokeStyle = 'green';
        context.lineWidth = 3;
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
    };

    const paintEdge = (point1, point2, context) => {
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.strokeStyle = 'green';
        context.lineWidth = 3;
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        paintArrowheadForEdges(point1, point2, context);
        paintVertex(point1, context);
        paintVertex(point2, context)

    };

    const paintArrowheadForEdges = (point1, point2, context) => {
        const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        let Agl;
        if (point2.y >= point1.y) {
            Agl = angle;
            const x2 = point2.x - RADIUS * Math.cos(Agl);
            const y2 = point2.y - RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl - Math.PI / 6), y2 - 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl + Math.PI / 6), y2 - 10 * Math.sin(Agl + Math.PI / 6));
            context.strokeStyle = 'green';
            context.lineWidth = 3;
            context.stroke();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
        } else {
            Agl = angle + Math.PI;
            const x2 = point2.x + RADIUS * Math.cos(Agl);
            const y2 = point2.y + RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl - Math.PI / 6), y2 + 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl + Math.PI / 6), y2 + 10 * Math.sin(Agl + Math.PI / 6));
            context.strokeStyle = 'green';
            context.lineWidth = 3;
            context.stroke();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
        }
    };

    const paintArc = (point1, point2, context) => {
        const angle = Math.atan((point2.y - point1.y) / (point2.x - point1.x));
        let x0 = RADIUS * Math.cos((Math.PI / 2 - angle));
        let y0 = RADIUS * Math.sin((Math.PI / 2 - angle));
        let x;
        let y;
        if (point1.y > 300 && point2.x <= 300 || point1.y <= 300 && point2.x > 300) {
            if (point2.x < 300 && point2.y >= 300 && point1.x < 300 && point1.y >= 300 && point1.y !== 600) {
                x = (point1.x + point2.x) / 2 - 4 * x0;
                y = (point1.y + point2.y) / 2 + 4 * y0;
            } else {
                x = (point1.x + point2.x) / 2 - 2 * x0;
                y = (point1.y + point2.y) / 2 + 2 * y0;
            }
        } else {
            x = (point1.x + point2.x) / 2 + 2 * x0;
            y = (point1.y + point2.y) / 2 - 2 * y0;
        }
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(x, y);
        context.lineTo(point2.x, point2.y);
        context.strokeStyle = 'green';
        context.lineWidth = 3;
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        const medium = new Point(x, y, 12);
        paintVertex(point1, context);
        paintVertex(point2, context);
        paintArrowheadArcs(medium, point2, context);
    };
    const paintArrowheadArcs = (point0, point2, context) => {
        const angle = Math.atan2(point2.y - point0.y, point2.x - point0.x);
        let Agl;
        if (point2.y >= point0.y) {
            Agl = angle;
            const x2 = point2.x - RADIUS * Math.cos(Agl);
            const y2 = point2.y - RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl - Math.PI / 6), y2 - 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 - 10 * Math.cos(Agl + Math.PI / 6), y2 - 10 * Math.sin(Agl + Math.PI / 6));
            context.strokeStyle = 'green';
            context.lineWidth = 3;
            context.stroke();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
        } else {
            Agl = angle + Math.PI;
            const x2 = point2.x + RADIUS * Math.cos(Agl);
            const y2 = point2.y + RADIUS * Math.sin(Agl);
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl - Math.PI / 6), y2 + 10 * Math.sin(Agl - Math.PI / 6));
            context.moveTo(x2, y2);
            context.lineTo(x2 + 10 * Math.cos(Agl + Math.PI / 6), y2 + 10 * Math.sin(Agl + Math.PI / 6));
            context.strokeStyle = 'green';
            context.lineWidth = 3;
            context.stroke();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
        }
    };

    const Loop_Edge_Arc = (i, j, context, vertex1, vertex2, matrix) => {
        if (i === j && matrix[i][j]) {
            paintLoop(vertex1, context);
        } else if (i < j && matrix[i][j]) {
            paintEdge(vertex1, vertex2, context);
        } else if (matrix[i][j] && matrix[j][i]) {
            paintArc(vertex1, vertex2, context);
        } else if (matrix[i][j] && i > j) {
            paintEdge(vertex1, vertex2, context);
        }
    };

    const checkIfAllVsClosed = (arrayOfVs) => {

        for (const el of arrayOfVs) {
            if (!el.isClosed) return false;
        }
        return true;
    };
    const checkIfAllVsVisited = (arrayOfVs) => {

        for (const el of arrayOfVs) {
            if (!el.isVisited) return false;
        }
        return true;
    };

    const createMatrix = () => {
        let result = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                row.push(0);
            }
            result.push(row);
        }
        return result;
    };


    let adjMatrixBFS = createMatrix();
    let sequenceBFS = [];
    const searchBFS = (context, adjMatrix, arrayOfVs, index, queue, jdex) => {

        if (!checkIfAllVsClosed(arrayOfVs) && !checkIfAllVsVisited(arrayOfVs)) {
            if (queue.isEmpty() && !arrayOfVs[0].isClosed) {
                arrayOfVs[0].isActive = true;
                arrayOfVs[0].isVisited = true;
                queue.addElement(arrayOfVs[0]);
                sequenceBFS.push(queue.getFirst().index + 1);
            }

            function getActiveVertex() {
                if (!checkIfAllVsClosed(arrayOfVs) && !checkIfAllVsVisited(arrayOfVs)) {
                    if (queue.getFirst().index < adjMatrix.length) {
                        if (!queue.isEmpty() && index.index === adjMatrix[queue.getFirst().index].length) { //закінчуємо обхід активної  вершини
                            queue.getFirst().isClosed = true;
                            queue.getFirst().isActive = false; //closing this vertex
                            paintVertex(queue.getFirst(), context);
                            arrayOfVs[queue.getFirst().index] = queue.getFirst();
                            index.index = 0;
                            queue.delElement(); //видаляє закриту вершину з черги
                            queue.getFirst().isActive = true;
                            queue.getFirst().isVisited = true;
                            paintVertex(queue.getFirst(), context);
                            arrayOfVs[queue.getFirst().index] = queue.getFirst();
                        }
                        if (!queue.isEmpty() && queue.getFirst().isClosed) { //перевірка на закритість наступної вершини
                            queue.getFirst().isActive = false;
                            paintVertex(queue.getFirst(), context);
                            arrayOfVs[queue.getFirst().index] = queue.getFirst();
                            queue.delElement();
                            index.index = 0;
                            getActiveVertex();
                        } else if (queue.isEmpty() && !checkIfAllVsClosed(arrayOfVs)) { //empty queue but not all vertices are closed
                            queue.addElement(arrayOfVs[jdex.index]); // in case it's isolated or hanging vertex
                            sequenceBFS.push(queue.getFirst().index + 1);
                            if (!queue.getFirst().isClosed) queue.getFirst().isActive = true;
                            if (!queue.getFirst().isVisited) queue.getFirst().isVisited = true;
                            index.index = 0;
                            paintVertex(queue.getFirst(), context);
                            if (jdex.index === arrayOfVs.length) jdex.index = 0;
                            else jdex.index++;
                            getActiveVertex();
                        }
                    }
                }
            }

            getActiveVertex();
            if (!queue.getFirst().isClosed) {
                queue.getFirst().isActive = true;
                queue.getFirst().isVisited = true;
            }


            paintVertex(queue.getFirst(), context);

            if (adjMatrix[queue.getFirst().index][index.index]) { //чи є ребро чи ні з активної вершини в іншу
                if (!arrayOfVs[index.index].isVisited) {
                    Loop_Edge_Arc(queue.getFirst().index, index.index, context, queue.getFirst(), arrayOfVs[index.index], adjMatrix);
                    if (!arrayOfVs[index.index].isVisited) {
                        sequenceBFS.push(index.index + 1);
                        adjMatrixBFS[queue.getFirst().index][index.index] = 1;
                    }
                    arrayOfVs[index.index].isVisited = true;
                    queue.addElement(arrayOfVs[index.index]);
                    paintVertex(queue.getFirst(), context);
                    paintVertex(queue.getLast(), context);
                    index.index++;
                } else {
                    index.index++;
                    searchBFS(context, adjMatrix, arrayOfVs, index, queue, jdex);
                }
            } else {
                index.index++;
                searchBFS(context, adjMatrix, arrayOfVs, index, queue);
            }
            if (index.index > adjMatrix.length) index.index = 0;

        } else {
            queue.getFirst().isActive = false;
            paintVertex(queue.getFirst(), context);
            console.log("Обхід завершено");
            BFSbutton.disabled = true;
            DFSbutton.disabled = true;
        }
    };
    const wrapperBFS = (context, adjMatrix, arrayVs) => {

        let queue = new Queue();
        let index = new Index();
        let jdex = new Index();
        BFSbutton.addEventListener("click", function () {
            searchBFS(context, adjMatrix, arrayVs, index, queue, jdex);
            console.log('Нова послідовність вершин: ');
            console.log(sequenceBFS);
            DFSbutton.disabled = true;
            console.log('Матриця суміжності дерева обходу вшир: ');
            console.log(adjMatrixBFS);
        });

    };
    wrapperBFS(ctx, matrixOr, ARRAY_VERTICES);

    let adjMatrixDFS = createMatrix();
    let sequenceDFS = [];
    const searchDFS = (context, adjMatrix, arrayOfVs, index, stack, jdex) => {

        if (!checkIfAllVsVisited(arrayOfVs)) {

            if (stack.isEmpty() && !arrayOfVs[0].isClosed) {
                arrayOfVs[0].isVisited = true;
                arrayOfVs[0].isActive = true;
                stack.addElement(arrayOfVs[0]);
                paintVertex(stack.getLast(), context);
                sequenceDFS.push(stack.getLast().index + 1);
            }
            if (adjMatrix[stack.getLast().index][index.index]) {

                if (!arrayOfVs[index.index].isVisited) {
                    sequenceDFS.push(arrayOfVs[index.index].index + 1);
                    adjMatrixDFS[stack.getLast().index][index.index] = 1;
                    stack.getLast().isActive = false;
                    paintVertex(stack.getLast(), context);
                    arrayOfVs[stack.getLast().index] = stack.getLast();
                    Loop_Edge_Arc(stack.getLast().index, index.index, context, stack.getLast(), arrayOfVs[index.index], adjMatrix);
                    arrayOfVs[index.index].isActive = true;
                    arrayOfVs[index.index].isVisited = true;
                    stack.addElement(arrayOfVs[index.index]);
                    arrayOfVs[stack.getLast().index] = stack.getLast();
                    paintVertex(stack.getLast(), context);
                    index.index = 0;
                } else if (!stack.isEmpty()) {
                    if (index.index < 12) {
                        index.index++;
                        searchDFS(context, adjMatrix, arrayOfVs, index, stack, jdex);
                    } else {
                        stack.getLast().isActive = false;
                        stack.getLast().isClosed = true;
                        arrayOfVs[stack.getLast().index] = stack.getLast();
                        paintVertex(stack.getLast(), context);
                        stack.delElement();
                        if (!checkIfAllVsVisited(arrayOfVs)) stack.getLast().isActive = true;
                        stack.getLast().isVisited = true;
                        arrayOfVs[stack.getLast().index] = stack.getLast();
                        paintVertex(stack.getLast(), context);
                        index.index = 0;
                    }
                } else {
                    arrayOfVs[jdex.index].isActive = true; //на випадок ізольованої вершини
                    arrayOfVs[jdex.index].isVisited = true;
                    stack.addElement(arrayOfVs[jdex.index]);
                    paintVertex(stack.getLast(), context);
                    jdex.index++;
                    if (jdex > 12) jdex.index = 0;
                }

            } else {
                if (index.index < 12) index.index++;
                else {
                    stack.getLast().isActive = false;
                    stack.getLast().isClosed = true;
                    arrayOfVs[stack.getLast().index] = stack.getLast();
                    paintVertex(stack.getLast(), context);
                    stack.delElement();
                    if (!checkIfAllVsVisited(arrayOfVs)) stack.getLast().isActive = true;
                    stack.getLast().isVisited = true;
                    arrayOfVs[stack.getLast().index] = stack.getLast();
                    paintVertex(stack.getLast(), context);
                    index.index = 0;
                }
                searchDFS(context, adjMatrix, arrayOfVs, index, stack, jdex);
            }

        } else {
            stack.getLast().isActive = false;
            paintVertex(stack.getLast(), context);
            console.log("Обхід завершено");
            DFSbutton.disabled = true;
            BFSbutton.disabled = true;
        }
    };
    const wrapperDFS = (context, adjMatrix, arrayVs) => {

        let stack = new Stack();
        let index = new Index();
        let jdex = new Index();
        DFSbutton.addEventListener("click", function () {
            searchDFS(context, adjMatrix, arrayVs, index, stack, jdex);
            console.log('Нова послідовність вершин: ');
            console.log(sequenceDFS);
            BFSbutton.disabled = true;
            console.log('Матриця суміжності дерева обходу вглиб: ');
            console.log(adjMatrixDFS);
        });
    };
    wrapperDFS(ctx, matrixOr, ARRAY_VERTICES);

});