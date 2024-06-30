// app.js
new Vue({
    el: '#app',
    data: {
        budget: null,
        isDarkMode: false,
        segments: [
            { name: 'Alimentos básicos', emoji: '🍚', percentage: 40, items: [], budget: 0, remaining: 0, newItemName: '', newItemPrice: 0, enabled: true, color: '#ffeb3b' },
            { name: 'Frutas e vegetais', emoji: '🍎', percentage: 20, items: [], budget: 0, remaining: 0, newItemName: '', newItemPrice: 0, enabled: true, color: '#8bc34a' },
            { name: 'Proteínas', emoji: '🍗', percentage: 20, items: [], budget: 0, remaining: 0, newItemName: '', newItemPrice: 0, enabled: true, color: '#f44336' },
            { name: 'Laticínios e derivados', emoji: '🧀', percentage: 10, items: [], budget: 0, remaining: 0, newItemName: '', newItemPrice: 0, enabled: true, color: '#673ab7' },
            { name: 'Produtos de higiene e limpeza', emoji: '🧼', percentage: 5, items: [], budget: 0, remaining: 0, newItemName: '', newItemPrice: 0, enabled: true, color: '#00bcd4' },
            { name: 'Outros', emoji: '🍫', percentage: 5, items: [], budget: 0, remaining: 0, newItemName: '', newItemPrice: 0, enabled: true, color: '#ff5722' }
        ]
    },
    methods: {
        updateBudgets() {
            const totalEnabledPercentage = this.segments.filter(s => s.enabled).reduce((sum, s) => sum + s.percentage, 0);
            this.segments.forEach(segment => {
                if (segment.enabled) {
                    segment.budget = (this.budget * (segment.percentage / totalEnabledPercentage)).toFixed(2);
                    segment.remaining = segment.budget - this.calculateTotal(segment.items);
                } else {
                    segment.budget = 0;
                    segment.remaining = 0;
                }
            });
        },
        calculateTotal(items) {
            return items.reduce((total, item) => total + item.price, 0);
        },
        addItem(segmentName) {
            const segment = this.segments.find(s => s.name === segmentName);
            if (segment.newItemName && segment.newItemPrice) {
                if (segment.remaining >= segment.newItemPrice) {
                    segment.items.push({ name: segment.newItemName, price: segment.newItemPrice });
                    segment.newItemName = '';
                    segment.newItemPrice = 0;
                    this.updateBudgets();
                } else {
                    alert(`Não há valor disponível para adicionar mais itens no segmento ${segment.name}`);
                }
            }
        },
        removeItem(segmentName, item) {
            const segment = this.segments.find(s => s.name === segmentName);
            segment.items = segment.items.filter(i => i !== item);
            this.updateBudgets();
        },
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
        },
        downloadList() {
            const date = new Date().toLocaleDateString();
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let yOffset = 10;
            doc.text(`Lista de Compras - ${date}`, 10, yOffset);
            yOffset += 10;
            this.segments.forEach((segment, index) => {
                if (segment.enabled) {
                    doc.text(`${segment.emoji} ${segment.name}:`, 10, yOffset);
                    yOffset += 10;
                    segment.items.forEach((item, idx) => {
                        doc.text(`- ${item.name}: R$ ${item.price}`, 20, yOffset);
                        yOffset += 10;
                    });
                    yOffset += 10;
                }
            });
            doc.save(`lista_de_compras_${date}.pdf`);
        }
    }
});
