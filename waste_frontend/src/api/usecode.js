from your_app_name.models import District, Panchayath, Ward

# This is your exact JSON data
data = [
    {
        "id":"01",
        "district": "trivandrum",
        "panchayaths": [
        {
            "id":"011",
            "name": "ANJUTENGU",
            "wards": [
                {"id":"0111","number":1},
                {"id":"0112","number":2},
                {"id":"0113","number":3},
                {"id":"0114","number":4},
                {"id":"0115","number":5}
                ]
        },
        {
            "id":"012",
            "name": "ANDOORKONAM",
            "wards": [
                {"id":"0121","number":1},
                {"id":"0122","number":2},
                {"id":"0123","number":3},
                {"id":"0124","number":4},
                {"id":"0125","number":5},
                {"id":"0126","number":6},
                {"id":"0127","number":7},
                {"id":"0128","number":8}
                ]
        },
        {
            "id":"013",
            "name": "EDAVA",
            "wards": [
                {"id":"0131","number":1},
                {"id":"0132","number":2},
                {"id":"0133","number":3},
                {"id":"0134","number":4},
                {"id":"0135","number":5}
                ]
        },
        {
            "id":"014",
            "name": "UZHAMALAKKAL",
            "wards": [
                {"id":"0141","number":1},
                {"id":"0142","number":2},
                {"id":"0143","number":3},
                {"id":"0144","number":4},
                {"id":"0145","number":5}
                ]
        },
        {
            "id":"015",
            "name": "OTTASEKHARAMANGALAM",
            "wards": [
                {"id":"0151","number":1},
                {"id":"0152","number":2},
                {"id":"0153","number":3},
                {"id":"0154","number":4},
                {"id":"0155","number":5}
                ]
        },
        {
            "id":"016",
            "name": "KADAKAVOOR",
            "wards": [
                {"id":"0161","number":1},
                {"id":"0162","number":2},
                {"id":"0163","number":3},
                {"id":"0164","number":4},
                {"id":"0165","number":5}
                ]
        }
        ]
    },
    {
        "id":"02",
        "district": "kollam",
        "panchayaths": [
        {
            "id":"021",
            "name": "Kulathupuzha",
            "wards": [
                {"id":"0211","number":1},
                {"id":"0212","number":2},
                {"id":"0213","number":3},
                {"id":"0214","number":4},
                {"id":"0215","number":5}
                ]
        },
        {
            "id":"022",
            "name": "Eroor",
            "wards": [
                {"id":"0221","number":1},
                {"id":"0222","number":2},
                {"id":"0223","number":3},
                {"id":"0224","number":4},
                {"id":"0225","number":5},
                {"id":"0226","number":6},
                {"id":"0227","number":7},
                {"id":"0228","number":8}
                ]
        },
        {
            "id":"023",
            "name": "Alayamon",
            "wards": [
                {"id":"0231","number":1},
                {"id":"0232","number":2},
                {"id":"0233","number":3},
                {"id":"0234","number":4},
                {"id":"0235","number":5}
                ]
        },
        {
            "id":"024",
            "name": "Anchal",
            "wards": [
                {"id":"0241","number":1},
                {"id":"0242","number":2},
                {"id":"0243","number":3},
                {"id":"0244","number":4},
                {"id":"0245","number":5}
                ]
        },
        {
            "id":"025",
            "name": "Edamulakkal",
            "wards": [
                {"id":"0251","number":1},
                {"id":"0252","number":2},
                {"id":"0253","number":3},
                {"id":"0254","number":4},
                {"id":"0255","number":5}
                ]
        },
        {
            "id":"026",
            "name": "Thenmala",
            "wards": [
                {"id":"0261","number":1},
                {"id":"0262","number":2},
                {"id":"0263","number":3},
                {"id":"0264","number":4},
                {"id":"0265","number":5}
                ]
        }
        ]
    },
    {
        "id": "03",
        "district": "pathanamthitta",
        "panchayaths": [
            {
                "id": "031",
                "name": "Chenneerkara",
                "wards": [
                    {"id": "0311", "number": 1},
                    {"id": "0312", "number": 2},
                    {"id": "0313", "number": 3},
                    {"id": "0314", "number": 4},
                    {"id": "0315", "number": 5}
                ]
            },
            {
                "id": "032",
                "name": "Elanthur",
                "wards": [
                    {"id": "0321", "number": 1},
                    {"id": "0322", "number": 2},
                    {"id": "0323", "number": 3},
                    {"id": "0324", "number": 4},
                    {"id": "0325", "number": 5}
                ]
            },
            {
                "id": "033",
                "name": "Kozhencherry",
                "wards": [
                    {"id": "0331", "number": 1},
                    {"id": "0332", "number": 2},
                    {"id": "0333", "number": 3},
                    {"id": "0334", "number": 4},
                    {"id": "0335", "number": 5}
                ]
            },
            {
                "id": "034",
                "name": "Naranganam",
                "wards": [
                    {"id": "0341", "number": 1},
                    {"id": "0342", "number": 2},
                    {"id": "0343", "number": 3},
                    {"id": "0344", "number": 4},
                    {"id": "0345", "number": 5}
                ]
            },
            {
                "id": "035",
                "name": "Eraviperoor",
                "wards": [
                    {"id": "0351", "number": 1},
                    {"id": "0352", "number": 2},
                    {"id": "0353", "number": 3},
                    {"id": "0354", "number": 4},
                    {"id": "0355", "number": 5}
                ]
            }
        ]
    },
    {
        "id": "04",
        "district": "alappuzha",
        "panchayaths": [
            {
                "id": "041",
                "name": "Ambalappuzha",
                "wards": [
                    {"id": "0411", "number": 1},
                    {"id": "0412", "number": 2},
                    {"id": "0413", "number": 3},
                    {"id": "0414", "number": 4},
                    {"id": "0415", "number": 5}
                ]
            },
            {
                "id": "042",
                "name": "Aryad",
                "wards": [
                    {"id": "0421", "number": 1},
                    {"id": "0422", "number": 2},
                    {"id": "0423", "number": 3},
                    {"id": "0424", "number": 4},
                    {"id": "0425", "number": 5}
                ]
            },
            {
                "id": "043",
                "name": "Champakulam",
                "wards": [
                    {"id": "0431", "number": 1},
                    {"id": "0432", "number": 2},
                    {"id": "0433", "number": 3},
                    {"id": "0434", "number": 4},
                    {"id": "0435", "number": 5}
                ]
            },
            {
                "id": "044",
                "name": "Kanjikkuzhy",
                "wards": [
                    {"id": "0441", "number": 1},
                    {"id": "0442", "number": 2},
                    {"id": "0443", "number": 3},
                    {"id": "0444", "number": 4},
                    {"id": "0445", "number": 5}
                ]
            },
            {
                "id": "045",
                "name": "Mannar",
                "wards": [
                    {"id": "0451", "number": 1},
                    {"id": "0452", "number": 2},
                    {"id": "0453", "number": 3},
                    {"id": "0454", "number": 4},
                    {"id": "0455", "number": 5}
                ]
            },
            {
                "id": "046",
                "name": "Punnapra",
                "wards": [
                    {"id": "0461", "number": 1},
                    {"id": "0462", "number": 2},
                    {"id": "0463", "number": 3},
                    {"id": "0464", "number": 4},
                    {"id": "0465", "number": 5}
                ]
            }
        ]
    },
    {
        "id": "05",
        "district": "kottayam",
        "panchayaths": [
            {
                "id": "051",
                "name": "Athirampuzha",
                "wards": [
                    {"id": "0511", "number": 1},
                    {"id": "0512", "number": 2},
                    {"id": "0513", "number": 3},
                    {"id": "0514", "number": 4},
                    {"id": "0515", "number": 5}
                ]
            },
            {
                "id": "052",
                "name": "Kumarakom",
                "wards": [
                    {"id": "0521", "number": 1},
                    {"id": "0522", "number": 2},
                    {"id": "0523", "number": 3},
                    {"id": "0524", "number": 4},
                    {"id": "0525", "number": 5}
                ]
            },
            {
                "id": "053",
                "name": "Pampady",
                "wards": [
                    {"id": "0531", "number": 1},
                    {"id": "0532", "number": 2},
                    {"id": "0533", "number": 3},
                    {"id": "0534", "number": 4},
                    {"id": "0535", "number": 5}
                ]
            },
            {
                "id": "054",
                "name": "Puthuppally",
                "wards": [
                    {"id": "0541", "number": 1},
                    {"id": "0542", "number": 2},
                    {"id": "0543", "number": 3},
                    {"id": "0544", "number": 4},
                    {"id": "0545", "number": 5}
                ]
            },
            {
                "id": "055",
                "name": "Vazhoor",
                "wards": [
                    {"id": "0551", "number": 1},
                    {"id": "0552", "number": 2},
                    {"id": "0553", "number": 3},
                    {"id": "0554", "number": 4},
                    {"id": "0555", "number": 5}
                ]
            },
            {
                "id": "056",
                "name": "Erumely",
                "wards": [
                    {"id": "0561", "number": 1},
                    {"id": "0562", "number": 2},
                    {"id": "0563", "number": 3},
                    {"id": "0564", "number": 4},
                    {"id": "0565", "number": 5}
                ]
            }
        ]
    },
    {
        "id": "06",
        "district": "idukki",
        "panchayaths": [
            {
                "id": "061",
                "name": "Munnar",
                "wards": [
                    {"id": "0611", "number": 1},
                    {"id": "0612", "number": 2},
                    {"id": "0613", "number": 3},
                    {"id": "0614", "number": 4},
                    {"id": "0615", "number": 5}
                ]
            },
            {
                "id": "062",
                "name": "Adimali",
                "wards": [
                    {"id": "0621", "number": 1},
                    {"id": "0622", "number": 2},
                    {"id": "0623", "number": 3},
                    {"id": "0624", "number": 4},
                    {"id": "0625", "number": 5}
                ]
            },
            {
                "id": "063",
                "name": "Kumily",
                "wards": [
                    {"id": "0631", "number": 1},
                    {"id": "0632", "number": 2},
                    {"id": "0633", "number": 3},
                    {"id": "0634", "number": 4},
                    {"id": "0635", "number": 5}
                ]
            },
            {
                "id": "064",
                "name": "Nedumkandam",
                "wards": [
                    {"id": "0641", "number": 1},
                    {"id": "0642", "number": 2},
                    {"id": "0643", "number": 3},
                    {"id": "0644", "number": 4},
                    {"id": "0645", "number": 5}
                ]
            },
            {
                "id": "065",
                "name": "Kattappana",
                "wards": [
                    {"id": "0651", "number": 1},
                    {"id": "0652", "number": 2},
                    {"id": "0653", "number": 3},
                    {"id": "0654", "number": 4},
                    {"id": "0655", "number": 5}
                ]
            },
            {
                "id": "066",
                "name": "Marayoor",
                "wards": [
                    {"id": "0661", "number": 1},
                    {"id": "0662", "number": 2},
                    {"id": "0663", "number": 3},
                    {"id": "0664", "number": 4},
                    {"id": "0665", "number": 5}
                ]
            }
        ]
    },
    {
        "id": "07",
        "district": "ernakulam",
        "panchayaths": [
        {
            "id": "071", "name": "Kumbalangi",
            "wards": [{"id": "0711", "number": 1}, {"id": "0712", "number": 2}, {"id": "0713", "number": 3}]
        },
        {
            "id": "072", "name": "Vengola",
            "wards": [{"id": "0721", "number": 1}, {"id": "0722", "number": 2}, {"id": "0723", "number": 3}]
        },
        {
            "id": "073", "name": "Mulamthuruthy",
            "wards": [{"id": "0731", "number": 1}, {"id": "0732", "number": 2}, {"id": "0733", "number": 3}]
        }
        ]
    },
    {
        "id": "08",
        "district": "thrissur",
        "panchayaths": [
        {
            "id": "081", "name": "Athirappilly",
            "wards": [{"id": "0811", "number": 1}, {"id": "0812", "number": 2}, {"id": "0813", "number": 3}]
        },
        {
            "id": "082", "name": "Punnayurkulam",
            "wards": [{"id": "0821", "number": 1}, {"id": "0822", "number": 2}, {"id": "0823", "number": 3}]
        },
        {
            "id": "083", "name": "Cherpu",
            "wards": [{"id": "0831", "number": 1}, {"id": "0832", "number": 2}, {"id": "0833", "number": 3}]
        }
        ]
    },
    {
        "id": "09",
        "district": "palakkad",
        "panchayaths": [
        {
            "id": "091", "name": "Malampuzha",
            "wards": [{"id": "0911", "number": 1}, {"id": "0912", "number": 2}, {"id": "0913", "number": 3}]
        },
        {
            "id": "092", "name": "Attappady",
            "wards": [{"id": "0921", "number": 1}, {"id": "0922", "number": 2}, {"id": "0923", "number": 3}]
        },
        {
            "id": "093", "name": "Kuzhalmannam",
            "wards": [{"id": "0931", "number": 1}, {"id": "0932", "number": 2}, {"id": "0933", "number": 3}]
        }
        ]
    },
    {
        "id": "10",
        "district": "malappuram",
        "panchayaths": [
        {
            "id": "101", "name": "Kondotty",
            "wards": [{"id": "1011", "number": 1}, {"id": "1012", "number": 2}, {"id": "1013", "number": 3}]
        },
        {
            "id": "102", "name": "Nilambur",
            "wards": [{"id": "1021", "number": 1}, {"id": "1022", "number": 2}, {"id": "1023", "number": 3}]
        },
        {
            "id": "103", "name": "Edappal",
            "wards": [{"id": "1031", "number": 1}, {"id": "1032", "number": 2}, {"id": "1033", "number": 3}]
        }
        ]
    },
    {
        "id": "11",
        "district": "kozhikode",
        "panchayaths": [
        {
            "id": "111", "name": "Beypore",
            "wards": [{"id": "1111", "number": 1}, {"id": "1112", "number": 2}, {"id": "1113", "number": 3}]
        },
        {
            "id": "112", "name": "Koduvally",
            "wards": [{"id": "1121", "number": 1}, {"id": "1122", "number": 2}, {"id": "1123", "number": 3}]
        },
        {
            "id": "113", "name": "Thamarassery",
            "wards": [{"id": "1131", "number": 1}, {"id": "1132", "number": 2}, {"id": "1133", "number": 3}]
        }
        ]
    },
    {
        "id": "12",
        "district": "wayanad",
        "panchayaths": [
        {
            "id": "121", "name": "Meppadi",
            "wards": [{"id": "1211", "number": 1}, {"id": "1212", "number": 2}, {"id": "1213", "number": 3}]
        },
        {
            "id": "122", "name": "Mananthavady",
            "wards": [{"id": "1221", "number": 1}, {"id": "1222", "number": 2}, {"id": "1223", "number": 3}]
        },
        {
            "id": "123", "name": "Sulthan Bathery",
            "wards": [{"id": "1231", "number": 1}, {"id": "1232", "number": 2}, {"id": "1233", "number": 3}]
        }
        ]
    },
    {
        "id": "13",
        "district": "kannur",
        "panchayaths": [
        {
            "id": "131", "name": "Thalassery",
            "wards": [{"id": "1311", "number": 1}, {"id": "1312", "number": 2}, {"id": "1313", "number": 3}]
        },
        {
            "id": "132", "name": "Payyannur",
            "wards": [{"id": "1321", "number": 1}, {"id": "1322", "number": 2}, {"id": "1323", "number": 3}]
        },
        {
            "id": "133", "name": "Iritty",
            "wards": [{"id": "1331", "number": 1}, {"id": "1332", "number": 2}, {"id": "1333", "number": 3}]
        }
        ]
    },
    {
        "id": "14",
        "district": "kasaragod",
        "panchayaths": [
        {
            "id": "141", "name": "Kanhangad",
            "wards": [{"id": "1411", "number": 1}, {"id": "1412", "number": 2}, {"id": "1413", "number": 3}]
        },
        {
            "id": "142", "name": "Nileshwaram",
            "wards": [{"id": "1421", "number": 1}, {"id": "1422", "number": 2}, {"id": "1423", "number": 3}]
        },
        {
            "id": "143", "name": "Uppala",
            "wards": [{"id": "1431", "number": 1}, {"id": "1432", "number": 2}, {"id": "1433", "number": 3}]
        }
        ]
    }

]



# Loop through and create matching database records
for d in data:
    dist, _ = District.objects.get_or_create(id=int(d["id"]), defaults={"name": d["district"]})
    for p in d["panchayaths"]:
        panch, _ = Panchayath.objects.get_or_create(id=int(p["id"]), defaults={"name": p["name"], "district": dist})
        for w in p["wards"]:
            Ward.objects.get_or_create(id=int(w["id"]), defaults={"number": w["number"], "panchayath": panch})

print("Database synced with JSON successfully!")