---
title: "A Per-Session Treasure Calculator"
date: 2020-03-11T22:49:23Z
draft: false
categories: ["Mechanics"]
tags: ['Generators']
summary: ""
---

When I was recently organising a mega-dungeon adventure for BECMI D&D, I was trying to come up with a simple way to think of the contentious subject of _treasure_.

My issue with treasure is mostly that in XP-for-coin systems like BECMI, B/X and their clones, it's hard to reconcile a 'simulationist' perspective (as espoused by Gary Gygax and the wonderful [_Treasure_ by Courtney Campbell](http://angband.oook.cz/steamband/Treasure.pdf), which a lot of the generated items below are derived from) with a balanced perspective which makes players feel like they're moving forward at an even keel in their adventures - the perspective closer to the XP-for-monsters setup of later D&D.

I do feel like the balanced perspecitve is not really the old-school RPG way, and I absolutely get the madcap swings and roundabouts of accidentally killing an ogre at 1st level and walking away with literal bags of coin, followed by the drudgery of clearing out kobold burrows for handfuls of silver pieces. Continually finding even spreads of treasure simply doesn't make for memorable stories.

This aside, I do sometimes want to know roughly how much treasure my players should be finding if I want them to be levelling up at an approximate rate of once every four sessions, once every ten sessions, and so on. It means that when they go and kill the dragon, I can happily award them mounds and mounds of loot, knowing that they haven't been getting overpaid in the previous few sessions.

As mentioned, the randomly generated treasure items below are adapted from Courtney Campbell's _Treasure_, with some more generic bits and pieces thrown in. The coin values of the jewels and coins are derived from the total per-session value; the number of examples in each type is derived from the number of hoards.

<div class="calculator-box">

<p>My party consists of <input type="number" class="inline-input number-of-players"> players.</p>

<p>They currently have <input type="number" class="inline-input current-xp"> XP, and need to have <input type="number" class="inline-input required-xp"> XP each to reach their next level.</p>

<p>I want them to take <input type="number" class="inline-input number-of-sessions"> sessions to level up (and each session should have <input type="number" class="inline-input number-of-hoards"> hoards of treasure).</p>

<button type="button" class="calculate-treasure">Hit me up!</button>

<div class="calculator-box">

<p>Every session, your players should loot, steal, or heroically liberate <input type="number" readonly class="inline-input number-of-coin"> coin worth of treasure (whether copper, silver, gold, salt, or dragonscales - whatever your main currency is). That's <input type="number" readonly class="inline-input coin-per-person"> coin per person, if they're 'share equally' sort of people.</p>


<div class="treasure-list"></div>

</div>

<script src="/js/indefinite.js"></script>

<script>
  function randomFromArray(array) {
    return array[Math.floor(Math.random()*array.length)];
  }
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  function Treasure(value) {
    this.rollType = function() {
      let roll = Math.floor(Math.random() * 100) + 1
      let result = treasureTypes.find(e => {
        return e.max >= roll && e.min <= roll
      })
      return result.name
    }
    this.generate = function(treasureType) {
      let string = ''
      if (treasureType === 'coins') {
        let coinsContainer = randomFromArray(containers)
        if (coinsContainer === "a hidden stash" || coinsContainer === "a loose pile" || coinsContainer === "a neat stack") {
          string += coinsContainer + ' of'
        } else {
          string += coinsContainer + ' ' + randomFromArray(prepositions)
        }
        string += ' ' + value + ' coins of varied marks, weights, ages and denominations'
      } else if (treasureType === 'gems') {
        let remainingValue = value
        while (remainingValue > 0) {
          let partValue = Math.floor(Math.random() * value) + 1
          if (partValue > remainingValue) {
            partValue = remainingValue
          }
          let result = gemTypes.find(e => {
            return e.max >= partValue && e.min <= partValue
          })
          string += 'a ' + randomFromArray(jewelAdjectives) + ' ' + randomFromArray(result.names) + ', worth ' + partValue + ' in coin'
          remainingValue = remainingValue - partValue
          if (remainingValue > 0) {
            string += '; '
          }
        }
      } else if (treasureType === 'preciousItems') {
        let item = randomFromArray(items)
        if (item === 'utensil') {
          item = randomFromArray(utensils)
        }
        let method = randomFromArray(generalMethods)
        let methodTwo = ''
        let jewelsOrMetals = Math.random() < 0.5
        if (jewelsOrMetals) { // Jewels
          methodTwo = randomFromArray(jewelMethods)
          let gemType = gemTypes.find(e => {
            return e.max >= value && e.min <= value
          })
          let gemName = randomFromArray(gemType.names)
          methodTwo += ' with ' + gemName
        } else { // Metals
          methodTwo = randomFromArray(metalMethods)
          let metal = randomFromArray(preciousMetals)
          methodTwo += ' with ' + metal
        }
        string += indefiniteArticle(method) + ' ' + method + ' ' + item + ', ' + methodTwo
        // string += ', worth ' + value + ' in coin'
      } else if (treasureType === 'weapons') {
        let blade = ''
        let handle = ''
        let roll = Math.floor(Math.random() * 100) + 1
        let modifier = modifiers.find(e => {
          return e.max >= roll && e.min <= roll
        })
        let weapon = randomFromArray(weapons)
        string += indefiniteArticle(weapon.name) + ' ' + modifier.name + ' ' + weapon.name
        if (weapon.blade) {
          let bladeShape = randomFromArray(bladeShapes)
          let bladeMaterial = randomFromArray(bladeMaterials)
          string += ' with ' + indefiniteArticle(bladeShape) + ' ' + bladeShape + ' blade of ' + bladeMaterial
        }
        if (weapon.handle) {
          let handleMaterial = randomFromArray(handleMaterials)
          string += (weapon.blade ? ' and ' : ' with ') + indefiniteArticle(handleMaterial) + ' ' + handleMaterial + ' handle'
        }
        // string += ', worth ' + value + ' in coin'
      }
      string = capitalize(string)
      return string
    }
  }
  const treasureTypes = [
    {
      name: 'preciousItems',
      label: 'Art and Precious Items',
      min: 1,
      max: 20
    },
    {
      name: 'coins',
      label: 'Coins',
      min: 21,
      max: 70
    },
    {
      name: 'gems',
      label: 'Gems, Jewels, and Precious Stones',
      min: 71,
      max: 90
    },
    {
      name: 'weapons',
      label: 'Weapons Magical and Rare',
      min: 91,
      max: 100
    }
  ]
  const gemTypes = [
    {
      type: 'ornamentalStones',
      min: 1,
      max: 25,
      names: [
        'azurite',
        'banded agate',
        'blue quartz',
        'eye agate',
        'hematite',
        'lapis lazuli',
        'malachite',
        'moss agate',
        'obsidian',
        'pyrite',
        'rhodochrosite',
        'tiger eye',
        'turquoise',
        'mother of pearl'
      ]
    },
    {
      type: 'semiPreciousStones',
      min: 26,
      max: 75,
      names: [
        'amazon stone',
        'bloodstone',
        'carnelian',
        'chalcedony',
        'chrysoprase',
        'citrine',
        'jasper',
        'moonstone',
        'onyx',
        'rock crystal',
        'sardonyx',
        'serpentine',
        'smoky quartz',
        'star rose quartz',
        'variscite',
      ]
    },
    {
      type: 'fancyStones',
      min: 76,
      max: 250,
      names: [
        'amber',
        'alamandine',
        'alexandrite',
        'amethyst',
        'chrysoberyl',
        'coral',
        'diopside',
        'garnet',
        'idicolite',
        'jade',
        'jet',
        'morganite',
        'nephrite',
        'pearl',
        'spinel',
        'spessarite',
        'sugilite',
        'rubellite tourmaline',
        'zircon',
      ]
    },
    {
      type: 'preciousStones',
      min: 251,
      max: 750,
      names: [
        'aquamarine',
        'garnet',
        'black pearl',
        'peridot',
        'spinel',
        'kunzite',
        'hiddenite',
        'topaz',
        'zoisite',
      ]
    },
    {
      type: 'gems',
      min: 751,
      max: 2500,
      names: [
        'black opal',
        'emerald',
        'fire opal',
        'garnet',
        'opal',
        'oriental amethyst',
        'oriental topaz',
        'sapphire',
        'star ruby',
        'star sapphire',
      ]
    },
    {
      type: 'jewels',
      min: 2501,
      max: 10000,
      names: [
        'ammolite',
        'black sapphire',
        'diamond',
        'jacinth',
        'oriental emerald',
        'ruby',
      ]
    }
  ]
  const items = [
    'anklet',
    'goblet',
    'chatelaine',
    'armband',
    'headband',
    'cuff link',
    'belt',
    'idol',
    'lapel pin',
    'box',
    'locket',
    'braclet',
    'medal',
    'bangle',
    'brooch',
    'medallion',
    'body piercing',
    'buckle',
    'necklace',
    'string of prayer beads',
    'chain',
    'pendant',
    'puzzle',
    'chalice',
    'pin',
    'aiguillette (decorative cord / ribbon tip)',
    'choker',
    'orb',
    'cock ring',
    'clasp',
    'ring',
    'pectoral',
    'collar',
    'scepter',
    'zierscheibe (ornamental disc)',
    'coffer',
    'seal',
    'icon',
    'comb',
    'statuette',
    'egg',
    'coronet',
    'tiara',
    'crown',
    'mask',
    'decanter',
    'nose ring/stud',
    'tool',
    'diadem',
    'circlet',
    'earring',
    'fob',
    'utensil',
  ]
  const utensils = [
    'adhesive',
    'adze',
    'ankus',
    'anvil',
    'auger',
    'awl',
    'ball',
    'bangle',
    'bell',
    'bellows',
    'block and tackle',
    'bottle',
    'bow drill',
    'bowl',
    'branding iron',
    'brush',
    'buckle',
    'stopper',
    'candelabra',
    'candlestick',
    'deck of cards',
    'carding comb',
    'carpenter’s square',
    'cauldron',
    'chisel',
    'coffin',
    'comb',
    'corckscrew',
    'crowbar',
    'cup',
    'box of dice',
    'drill',
    'drinking jack',
    'drinking horn',
    'doll',
    'door handles',
    'ewer',
    'eye-patch',
    'file',
    'fingerpick',
    'fish-hook',
    'flagon',
    'fork',
    'game figurine',
    'grindstone',
    'goblet',
    'hammer',
    'hilt',
    'hoe',
    'hollow reed',
    'kettle',
    'key ring',
    'knives',
    'ladle',
    'loom',
    'mallet',
    'mantle',
    'mask',
    'mirror',
    'mortar & pestle',
    'monocle',
    'mug',
    'nails',
    'paint',
    'pan',
    'peg-leg',
    'pickaxe',
    'pitcher',
    'pitchfork',
    'pen case',
    'platter',
    'plow',
    'pot',
    'potters wheel',
    'pouches and small boxes',
    'pulley',
    'rake',
    'rope',
    'salt cellar',
    'saw',
    'pair of scissors',
    'scepter',
    'shepherd’s crook',
    'sledge',
    'spade',
    'spit',
    'spoon',
    'stein',
    'thimble',
    'tray',
    'toy',
    'vestment',
    'wedge',
    'wheelbarrow',
    'whetstone',
    'wire',
    'whistle',
  ]
  const weapons = [
    {
      name: 'club',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'dagger',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'greatclub',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'handaxe',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'javelin',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'light hammer',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'mace',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'quarterstaff',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'sickle',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'spear',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'crossbow',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'shortbow',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'battleaxe',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'flail',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'glaive',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'greataxe',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'greatsword',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'halberd',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'lance',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'longsword',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'maul',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'morningstar',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'pike',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'rapier',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'scimitar',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'shortsword',
      material: 'metal',
      blade: true,
      handle: true,
    },
    {
      name: 'trident',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'war pick',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'warhammer',
      material: 'metal',
      blade: false,
      handle: true,
    },
    {
      name: 'whip',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'crossbow',
      material: 'wood',
      blade: false,
      handle: true,
    },
    {
      name: 'longbow',
      material: 'wood',
      blade: false,
      handle: true,
    },
  ]
  const modifiers = [
    {
      name: '+1',
      min: 1,
      max: 50
    },
      {
      name: '+2',
      min: 51,
      max: 80
    },
    {
      name: '+3',
      min: 81,
      max: 100
    },
  ]
  const containers = ['a bag', 'a sack', 'a barrel', 'a cask', 'a casket', 'a coffer', 'a kist', 'a chest', 'a huge chest', 'a trunk', 'an urn', 'a jar', 'a hidden stash', 'a loose pile', 'a neat stack']
  const prepositions = ['brimming with', 'full of', 'spilling over with', 'heavy with', 'containing']
  const jewelAdjectives = ['perfect', 'flawless', 'flawed', 'shimmering', 'glimmering', 'glittering', 'flashing', 'damaged', 'cracked', 'exquisite', 'radiant']
  const preciousMetals = ['gold', 'silver', 'electrum', 'platinum', 'rose gold', 'black gold', 'mithril']
  const generalMethods = ['carved', 'engraved', 'fretworked', 'polished', 'painted', 'lacquered', 'decorated']
  const jewelMethods = ['inlaid', 'studded', 'ornamented', 'adorned', 'trimmed']
  const metalMethods = ['inlaid', 'ornamented', 'trimmed']
  const bladeMaterials = ['damascus steel', 'layered steel', 'crystal', 'glass', 'obsidian', 'ceramic', 'bone', 'adamantine', 'mithril', 'cold iron', 'silver', 'ironwood']
  const bladeShapes = ['straight','curved','tapered','wavy','notched','spiked','toothed','jagged']
  const handleMaterials = ['ivory', 'bone', 'wooden', 'antler', 'stone', 'ebony', 'steel', 'adamantine', 'obsidian', 'iron', 'crystal', 'ceramic', 'mithril', 'silver', 'ironwood']
  $(document).ready(function() {
    $('.calculate-treasure').click(function() {
      let numberOfPlayers = $('.number-of-players').val()
      let currentXp = $('.current-xp').val()
      let requiredXp = $('.required-xp').val()
      let numberOfSessions = $('.number-of-sessions').val()
      let numberOfHoards = $('.number-of-hoards').val()
      let numberOfCoin = Math.floor(((requiredXp - currentXp) * numberOfPlayers ) / numberOfSessions)
      let coinPerPerson = Math.floor(numberOfCoin / numberOfPlayers)
      let coinPerHoard = Math.floor(numberOfCoin / numberOfHoards)
      if (numberOfCoin > 0 && coinPerPerson > 0) {
        $('.number-of-coin').val(numberOfCoin)
        $('.coin-per-person').val(coinPerPerson) 
        $('.treasure-list').html('')
        for (var i = 0; i < treasureTypes.length; i++) {
          $('.treasure-list').append(`<h5>${treasureTypes[i]['label']}</h5>`)
          $('.treasure-list').append('<ul>')
          let treasure = new Treasure(Math.floor(coinPerHoard))
          for (var x = 0; x < numberOfHoards; x++) {
            let treasureType = treasureTypes[i]['name']
            $('.treasure-list ul').last().append(`<li>${treasure.generate(treasureType)}</li>`)
          }
        }
      } else {
        $('.number-of-coin').val('')
        $('.coin-per-person').val('')
      }
    })
  })
</script>