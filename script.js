var model = {
    data : [
        {ticker:'APPL', volume:6},
        {ticker:'MSFT', volume:8},
        {ticker:'GE', volume:10},
        {ticker:'DIS', volume:2},
        {ticker:'PEP', volume:1},
        {ticker:'T', volume:5},

    ],

    setData : function(new_data){
        this.data.push(new_data);
        if (typeof(Storage) != "undefined") {
            // Store
            localStorage.setItem("tradeData", this.data);
        } else {
            console.log("Sorry, your browser does not support Web Storage...");
        }
    },
    getData : function(url){
        if(url != "") {
            $.get(url, function(data) {
                this.data = data;
            });
        }
        return this.data;
    },

    exist: false,
    setExist : function(state){
        this.exist = state;
    },
    getExist : function(){
        return this.exist;
    },
    getVolume : function(){
        var total=0;
        for(var i=0; i<this.data.length; i++){
            total+= this.data[i].volume;
        }
        return total;
    },
    initStorage : function(){
        if (typeof(Storage) != "undefined") {
            // Store
            localStorage.setItem("tradeData", this.data);
        } else {
            console.log("Sorry, your browser does not support Web Storage...");
        }
    }
}

var view = {
    tableDiv : $('#here_table'),
    table : $('<table></table>').addClass('myTable').attr('id', 'myTable'),
    totalVolume : $('#total'),
    newTicker : $("#ticker"),
    newVolume : $("#volume"),

    //create table
    init : function(model){
        model.initStorage();
        var row = $('<tr></tr>').addClass('title');
        var col1 = $('<th></th>').addClass('ticker').text('Ticker');
        var col2 = $('<th></th>').addClass('volume').text('Volume');
        row.append(col1);
        row.append(col2);
        this.table.append(row);

        for(var i=0; i<model.getData().length; i++){

            var row = $('<tr></tr>').addClass('context');
            var col1 = $('<td></td>').addClass('td_ticker').text(model.getData()[i].ticker);
            var col2 = $('<td></td>').addClass('td_volume').text(model.getData()[i].volume);
            row.append(col1);
            row.append(col2);
            this.table.append(row);
            this.totalVolume.text(model.getVolume());

        }
        this.tableDiv.append(this.table);
    },

    //add new trade
    update : function(model) {
        if(this.newTicker.val() != "" && this.newVolume.val() != "") {
            for(var i=0; i<model.getData().length; i++){
                if(this.newTicker.val() === model.getData()[i].ticker) {
                    model.getData()[i].volume += parseInt(this.newVolume.val());
                    this.table.find("tr").eq(i+1).find("td").eq(1).text(parseInt(this.table.find("tr").eq(i+1).find("td").eq(1).text())+parseInt(this.newVolume.val()));
                    model.setExist(true);
                    break;
                }
            }
            if(!model.getExist()) {
                var row = $('<tr></tr>').addClass('context');
                var col1 = $('<td></td>').addClass('td_ticker').text(this.newTicker.val());
                var col2 = $('<td></td>').addClass('td_volume').text(this.newVolume.val());
                row.append(col1);
                row.append(col2);
                this.table.append(row);
                var new_trade = {ticker:this.newTicker.val(), volume:parseInt(this.newVolume.val())};
                model.setData(new_trade);
            }
            model.setExist(false);
            this.totalVolume.html(model.getVolume());
            console.log(model.getVolume());
        }
    }
}

var controller = {

    V : view,
    M : model,
    create : function(){
        this.V.init(this.M);
    },
    add : function(){
        this.V.update(this.M);
    }
}

$(document).ready(function(){

    controller.create.call(controller);
    $("#add_trade").click(function(){
        controller.add.call(controller);
    });
});