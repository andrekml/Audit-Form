document.addEventListener('DOMContentLoaded', function() {
    const dataTable = document.getElementById('dataTable');
    const newBtn = document.getElementById('newBtn');
    const addRowBtn = document.getElementById('addRowBtn');
    const addColBtn = document.getElementById('addColBtn');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');

    const newModal = document.getElementById('newModal');
    const importModal = document.getElementById('importModal');
    const exportModal = document.getElementById('exportModal');

    const closeNewModal = document.getElementById('closeNewModal');
    const closeImportModal = document.getElementById('closeImportModal');
    const closeExportModal = document.getElementById('closeExportModal');

    const cancelNewBtn = document.getElementById('cancelNewBtn');
    const createNewBtn = document.getElementById('createNewBtn');
    const cancelImportBtn = document.getElementById('cancelImportBtn');
    const confirmImportBtn = document.getElementById('confirmImportBtn');
    const cancelExportBtn = document.getElementById('cancelExportBtn');
    const confirmExportBtn = document.getElementById('confirmExportBtn');

    const toast = document.getElementById('toast');

    function showModal(modal) {
        modal.style.display = 'flex';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    newBtn.addEventListener('click', () => showModal(newModal));
    importBtn.addEventListener('click', () => showModal(importModal));
    exportBtn.addEventListener('click', () => showModal(exportModal));

    closeNewModal.addEventListener('click', () => hideModal(newModal));
    closeImportModal.addEventListener('click', () => hideModal(importModal));
    closeExportModal.addEventListener('click', () => hideModal(exportModal));

    cancelNewBtn.addEventListener('click', () => hideModal(newModal));
    cancelImportBtn.addEventListener('click', () => hideModal(importModal));
    cancelExportBtn.addEventListener('click', () => hideModal(exportModal));

    createNewBtn.addEventListener('click', function() {
        const rowCount = parseInt(document.getElementById('rowCount').value);
        const colCount = parseInt(document.getElementById('colCount').value);

        if (rowCount > 0 && colCount > 0) {
            createNewTable(rowCount, colCount);
            hideModal(newModal);
            showToast('New table created successfully!');
        } else {
            showToast('Please enter valid row and column counts');
        }
    });

    function createNewTable(rows, cols) {
        let headerRow = '<tr>';
        for (let i = 1; i <= cols; i++) {
            headerRow += `<th>Column ${i}</th>`;
        }
        headerRow += '</tr>';

        let tableBody = '';
        for (let i = 0; i < rows; i++) {
            tableBody += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableBody += '<td class="editable" contenteditable="true"></td>';
            }
            tableBody += '</tr>';
        }

        dataTable.innerHTML = '<thead>' + headerRow + '</thead><tbody>' + tableBody + '</tbody>';
    }

    addRowBtn.addEventListener('click', function() {
        const tbody = dataTable.querySelector('tbody');
        if (!tbody) return;

        const cols = dataTable.querySelector('thead tr').cells.length;
        let newRow = '<tr>';

        for (let i = 0; i < cols; i++) {
            newRow += '<td class="editable" contenteditable="true"></td>';
        }
        newRow += '</tr>';

        tbody.insertAdjacentHTML('beforeend', newRow);
        showToast('New row added successfully!');
    });

    addColBtn.addEventListener('click', function() {
        const headerRow = dataTable.querySelector('thead tr');
        if (!headerRow) return;

        const colNumber = headerRow.cells.length + 1;
        headerRow.insertAdjacentHTML('beforeend', `<th>Column ${colNumber}</th>`);

        const rows = dataTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.insertAdjacentHTML('beforeend', '<td class="editable" contenteditable="true"></td>');
        });

        showToast('New column added successfully!');
    });

    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the table? All data will be lost.')) {
            createNewTable(1, 1);
            showToast('Table cleared successfully!');
        }
    });

    confirmImportBtn.addEventListener('click', function() {
        const fileInput = document.getElementById('importFile');
        if (fileInput.files.length === 0) {
            showToast('Please select a file to import');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            if (window.Android) {
                window.Android.importExcel(file.name, e.target.result);
            } else {
                showToast('Import functionality requires Android app');
            }
        };

        reader.onerror = function() {
            showToast('Error reading file');
        };

        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }

        hideModal(importModal);
    });

    confirmExportBtn.addEventListener('click', function() {
        const fileName = document.getElementById('fileName').value || 'data';
        const fileType = document.getElementById('fileType').value;

        const headers = [];
        const data = [];

        const headerCells = dataTable.querySelectorAll('thead th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent);
        });

        const rows = dataTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.textContent);
            });
            data.push(rowData);
        });

        if (window.Android) {
            window.Android.exportExcel(fileName, fileType, JSON.stringify(headers), JSON.stringify(data));
        } else {
            console.log('Export data:', {fileName, fileType, headers, data});
            showToast('Export functionality requires Android app');
        }

        hideModal(exportModal);
    });

    createNewTable(5, 3);
});
