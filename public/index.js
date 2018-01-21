'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

// Step 1 & 2
 
var tab=[0,0,0];
  for (var i =0; i<deliveries.length;i++) 
  { 
      
      var infoTruck = iDTruckers(deliveries[i].truckerId);
      var reductionprice = 0;
      tab[i] = deliveries[i].distance*infoTruck[0] + deliveries[i].volume*infoTruck[1];
      if(deliveries[i].volume <= 5)
      {
        reductionprice = 1
      }
      else if(deliveries[i].volume > 5 && deliveries[i].volume <= 10)
      {
        reductionprice = 0.90;
      }
      else if(deliveries[i].volume > 10 && deliveries[i].volume <= 25)
      {
        reductionprice = 0.70;
      }
      else if(deliveries[i].volume > 25)
      {
        reductionprice = 0.50;
      }
      tab[i] *= reductionprice;
      deliveries[i].price = tab[i];
         
      DeductiblePrice();
      SplitShippingPrice();
      PayTheActors(); 
  }

 
function iDTruckers(findId) 
{ 
    for (var i = 0; i < truckers.length; i++) 
    { 
      if (findId == truckers[i].id) 
      { 
        return [truckers[i].pricePerKm,truckers[i].pricePerVolume]; 
      } 
    } 
}

//Step 3

function SplitShippingPrice()
{
  for(var i = 0; i<deliveries.length;i++)
  {
      var com = deliveries[i].price*0.30;
      var insurance = com /2;
      var treasury = Math.floor(deliveries[i].distance/500 + 1);
      var convargcom = com - (insurance + treasury);

      deliveries[i].commission.insurance = insurance;
      deliveries[i].commission.convargo = convargcom;
      deliveries[i].commission.treasury = treasury;
  }
}

//Step 4
function DeductiblePrice()
{
  for(var i = 0; i<deliveries.length;i++)
  {
    if(deliveries[i].options.deductibleReduction == true)
    {
      var infoTruck = iDTruckers(deliveries[i].truckerId);
      var oldvolumeprice = deliveries[i].volume*infoTruck[1];
      var surplus = deliveries[i].volume;
      var newvolumeprice = deliveries[i].volume*infoTruck[1] + surplus ;

      deliveries[i].price = deliveries[i].price + (newvolumeprice - oldvolumeprice);
    }  
  }
}

//Step 5
function PayTheActors()
{
  for(var i = 0; i<deliveries.length;i++)
  {
    for(var j = 0; j<actors.length;j++)
    {
      if(actors[j].deliveryId == deliveries[i].id)
      {
        var truckerAmount = deliveries[i].price*0.7;

        actors[j].payment[0].amount = deliveries[i].price;
        actors[j].payment[1].amount = truckerAmount;
        actors[j].payment[2].amount = deliveries[i].commission.insurance;
        actors[j].payment[3].amount = deliveries[i].commission.treasury;
        actors[j].payment[4].amount = deliveries[i].commission.convargo;

      }
    }
  }   
}


//Je crois avoir mal compris l'étape 4. Quand l'option de réduction déductible est mise à vrai, le "shipper" doit payer 1€/m3 en +, mais doit-il aussi rajouter 200€ ?
// Ou alors c'est seulement dans le cas où il y a vol/accident ? Dans le doute je n'ai pas rajouter ces 200€ aux frais du "shipper".

console.log(truckers);
console.log(deliveries);
console.log(actors);