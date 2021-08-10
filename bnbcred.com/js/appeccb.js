let VaultsContract
let currentAddr
let upline
let referrer = "0x0000000000000000000000000000000000000000"
let inited = false

function toBNB(amount) {
    return parseFloat(parseFloat(amount / 1e18).toFixed(10))
}
window.addEventListener('load', async function() {
    if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)

        let networkID = await web3.eth.net.getId();
        console.log('network id', networkID);
        /*
        if (networkID != 80001 && networkID != 137) {
            Swal.fire({
                icon: 'error',
                text: "Please switch to Polygon Mainnet!",
            })
            return
        }
        */
        let accounts = await web3.eth.getAccounts()
        currentAddr = accounts[0]
        console.log(VaultsContract)
        runAPP()
        return
    }
})
setTimeout(function() {
    if (typeof(window.BinanceChain) == `undefined` && typeof(window.web3) == `undefined` && typeof(window.ethereum) == `undefined`) {
        Swal.fire({
            icon: 'error',
            text: 'Please login using MetaMask!',
        })
    } else {
        $('#con_wallet').text(currentAddr.substring(1, 15) + '...');
        $('#con_wallet').val(2);
    }
}, 1500)
async function runAPP() {
    let networkID = await web3.eth.net.getId();
    console.log('network id', networkID);
    if (networkID == 80001) {
        $(".dev_version").show()
        VaultsContract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS_DEV)
    } else {
        VaultsContract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS)
    }
    $("#ref-link").val("http://poly20.com?ref=" + currentAddr)
    let daysElement = document.querySelector("#days")
    let hoursElement = document.querySelector("#hours")
    let minutesElement = document.querySelector("#minutes")
    let secondsElement = document.querySelector("#seconds")
    setTimeout(function() {
        VaultsContract.methods.START_TIME_11GMT().call().then(function(r) {
            let myCountDown = new ysCountDown(new Date(r * 1000), function(remaining, finished) {
                if (finished) {
                    $(".countdown-wrap").hide()
                } else {
                    if ($(".countdown-wrap").css('display') == 'none') {
                        $(".countdown-wrap").show()
                    }
                    daysElement.textContent = remaining.totalDays
                    hoursElement.textContent = remaining.hours
                    minutesElement.textContent = remaining.minutes
                    secondsElement.textContent = remaining.seconds
                }
            })
        })
        VaultsContract.methods.getUserTotalDeposits(currentAddr).call().then(function(r) {
            $("#total_invested").html(toBNB(r));
        })

        VaultsContract.methods.getUserReferralTotalBonus(currentAddr).call().then(function(r) {
            $("#referral_total_bonus").html(toBNB(r));
        })
        VaultsContract.methods.getUserReferralBonus(currentAddr).call().then(function(r) {
            $("#referral_avaliable").html(toBNB(r));
        })

        VaultsContract.methods.getUserReferralBonus(currentAddr).call().then(function(r) {
            $("#referral_avaliable").html(toBNB(r));
        })

        VaultsContract.methods.getUserReferralWithdrawn(currentAddr).call().then(function(r) {
            $("#referral_avaliable").html(toBNB(r));
        })

        VaultsContract.methods.totalStaked().call().then(function(r) {
            $("#total_staked").html(toBNB(r));
        })
        // VaultsContract.methods.getUserReferrer(currentAddr).call().then(function(r) {
        //     $("#upline-address").html(r);
        // })
        
        VaultsContract.methods.getUserAvailable(currentAddr).call().then(function(r) {
            console.log('user avaliable', r);
            $("#user-available").html(toBNB(r))
        })

        VaultsContract.methods.getUserAmountOfDeposits(currentAddr).call().then(function(r) {
            // console.log('deposit length',r);
            deposit_length = r;
            c = Math.floor(Date.now() / 1e3);
            s = [14, 7, 14, 21];
            mystake = [];
            var html = '';
            var valueToPush = new Array();
            if (r > 0) {

                for (var i = 0; i < r; i++) {


                    VaultsContract.methods.getUserDepositInfo(currentAddr, i).call().then(function(p) {
                        console.log('getUserDepositInfo', p);
                        daysLeft = (
                            Number(p.finish - c) / 84600
                        ).toFixed(2);

                        if (daysLeft <= 0) {
                            status = "Finish";
                        } else {
                            status = "Active";
                        }
                        var t = _(s[p.plan], daysLeft);
                        percentFinish = t > 100 ? 100 : t;
                        amount = toBNB(p.amount).toFixed(2);
                        profit = toBNB(p.profit).toFixed(2);
                        plan = Number(parseInt(p.plan) + parseInt(1));
                        // plan = p.plan;
                        percent = Number(p.percent / 10);
                        start = new Intl.DateTimeFormat("en-GB", {
                            month: "short",
                            day: "2-digit",
                        }).format(1e3 * p.start);


                        finish = new Intl.DateTimeFormat("en-GB", {
                            month: "short",
                            day: "2-digit",
                        }).format(1e3 * p.finish);

                        html += '<div class="col-md-4">';
                        html += ' <div class="stakeDiv">';
                        html += ' <div class="d-flex align-items-start justify-content-between">';
                        html += '<div class="mb-3">';
                        html += '<h5>' + plan + '</h5>';
                        html += ' <p>' + percent + '</p>';
                        html += '</div>';
                        html += '<h5 class="mb-3">' + status + '</h5>';
                        html += '<div class="mb-3">';
                        html += '<p>' + start + '<i class="fa fa-arrow-right pl-1"></i></p>';
                        html += ' <p class="text-right">' + finish + '</p>';
                        html += '</div></div><div class="d-flex align-items-start justify-content-between"><div class="mb-2">';
                        html += '<h2>' + amount + '</h2>';
                        html += '<h4>BNB</h4>';
                        html += '</div><div class="mb-2">';
                        html += '<h2>' + profit + '</h2>';
                        html += '<h4 class="text-right">BNB</h4></div></div><div class="progress">';
                        html += ' <span style="width: ' + percentFinish + '%">' + percentFinish + '%</span>';
                        html += ' </div></div></div>';
                        console.log(html);
                        console.log('i', i);
                        console.log('r', r);
                        // if(parseInt(i) == parseInt(r-1))
                        // {
                        //     $('#mystake_row').append(html);
                        // }
                        // $('#mystake_row').append(html);

                    })
                }
                // document.querySelector('#mystake_row').innerHTML = html;
                //console.log('mystake',mystake);
                setTimeout(() => {
                    append_html(html);
                }, 2000);

            }



        })



        function n(e, t) {
            if ("..." !== e) {
                for (var n = 100, a = 0; a < t; a++) n += n * (e / 100);
                return Math.round(n - 100);
            }
            return "...";
        }

        function _(e, t) {
            var n = ((e - t) / e) * 100;
            return Math.round(Math.abs(n));
        }

        VaultsContract.methods.getUserDownlineCount(currentAddr).call().then(function(r) {
            // console.log('downline',r[0]);
            $('#ref_1').html(r[0]);
            $('#ref_2').html(r[1]);
            $('#ref_3').html(r[2]);
        })


        VaultsContract.methods.getUserReferralBonus(currentAddr).call().then(function(r) {
            $("#total-refbonus").text(toBNB(r))
        })
        // VaultsContract.methods.getUserAmountOfReferrals(currentAddr).call().then(function(r) {
        //     let ref_1 = toBNB(r[0])
        //     let ref_2 = toBNB(r[1])
        //     let ref_3 = toBNB(r[2])
        //     $("#ref_1").text(ref_1)
        //     $("#ref_2").text(ref_2)
        //     $("#ref_3").text(ref_3)
        // })
        // VaultsContract.methods.getUserReferrer(currentAddr).call().then(function(r) {
        //     if (r != 0x0000000000000000000000000000000000000000 && r != referrer) {
        //         $("#upline-address").text([...r.split('').slice(0, 8), '...', ...r.split('').slice(42 - 6)].join(''))
        //     } else {
        //         $("#upline-address").text("-")
        //     }
        // })
        // VaultsContract.methods.getContractUsersRate(currentAddr).call().then(function(r) {
        //     let rate = r
        //     let userBonus = (rate - 300) / 100
        //     VaultsContract.methods.getUserPercentRate(currentAddr).call().then(function(res) {
        //         let totalRate = res
        //         let holdBonus = (totalRate - rate) / 100
        //         $("#basic-profit").text("3%")
        //         $("#user-bonus").text(userBonus.toFixed(2) + '%')
        //         $("#hold-bonus").text(holdBonus.toFixed(2) + '%')
        //     })
        // })
        // VaultsContract.methods.getUserAmountOfDeposits(currentAddr).call().then(function(r) {
        //     let amount = r
        //     if (amount > 5) {
        //         amount = 5
        //     }
        //     let content = ''
        //     if (amount == 1) {
        //         VaultsContract.methods.getUserDepositInfo(currentAddr, 0).call().then(function(res) {
        //             let depAmount = toBNB(res[0])
        //             let startTime = res[1]
        //             let readableTime = getTime(startTime)
        //             content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //             $("#user-deposits").html(content)
        //         })
        //     }
        //     if (amount == 2) {
        //         VaultsContract.methods.getUserDepositInfo(currentAddr, 0).call().then(function(res) {
        //             let depAmount = toBNB(res[0])
        //             let startTime = res[1]
        //             let readableTime = getTime(startTime)
        //             content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //             VaultsContract.methods.getUserDepositInfo(currentAddr, 1).call().then(function(res) {
        //                 depAmount = toBNB(res[0])
        //                 startTime = res[1]
        //                 readableTime = getTime(startTime)
        //                 content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                 $("#user-deposits").html(content)
        //             })
        //         })
        //     }
        //     if (amount == 3) {
        //         VaultsContract.methods.getUserDepositInfo(currentAddr, 0).call().then(function(res) {
        //             let depAmount = toBNB(res[0])
        //             let startTime = res[1]
        //             let readableTime = getTime(startTime)
        //             content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //             VaultsContract.methods.getUserDepositInfo(currentAddr, 1).call().then(function(res) {
        //                 depAmount = toBNB(res[0])
        //                 startTime = res[1]
        //                 readableTime = getTime(startTime)
        //                 content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                 VaultsContract.methods.getUserDepositInfo(currentAddr, 2).call().then(function(res) {
        //                     depAmount = toBNB(res[0])
        //                     startTime = res[1]
        //                     readableTime = getTime(startTime)
        //                     content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                     $("#user-deposits").html(content)
        //                 })
        //             })
        //         })
        //     }
        //     if (amount == 4) {
        //         VaultsContract.methods.getUserDepositInfo(currentAddr, 0).call().then(function(res) {
        //             let depAmount = toBNB(res[0])
        //             let startTime = res[1]
        //             let readableTime = getTime(startTime)
        //             content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //             VaultsContract.methods.getUserDepositInfo(currentAddr, 1).call().then(function(res) {
        //                 depAmount = toBNB(res[0])
        //                 startTime = res[1]
        //                 readableTime = getTime(startTime)
        //                 content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                 VaultsContract.methods.getUserDepositInfo(currentAddr, 2).call().then(function(res) {
        //                     depAmount = toBNB(res[0])
        //                     startTime = res[1]
        //                     readableTime = getTime(startTime)
        //                     content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                     VaultsContract.methods.getUserDepositInfo(currentAddr, 3).call().then(function(res) {
        //                         depAmount = toBNB(res[0])
        //                         startTime = res[1]
        //                         readableTime = getTime(startTime)
        //                         content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                         $("#user-deposits").html(content)
        //                     })
        //                 })
        //             })
        //         })
        //     }
        //     if (amount == 5) {
        //         VaultsContract.methods.getUserDepositInfo(currentAddr, 0).call().then(function(res) {
        //             let depAmount = toBNB(res[0])
        //             let startTime = res[1]
        //             let readableTime = getTime(startTime)
        //             content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //             VaultsContract.methods.getUserDepositInfo(currentAddr, 1).call().then(function(res) {
        //                 depAmount = toBNB(res[0])
        //                 startTime = res[1]
        //                 readableTime = getTime(startTime)
        //                 content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                 VaultsContract.methods.getUserDepositInfo(currentAddr, 2).call().then(function(res) {
        //                     depAmount = toBNB(res[0])
        //                     startTime = res[1]
        //                     readableTime = getTime(startTime)
        //                     content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                     VaultsContract.methods.getUserDepositInfo(currentAddr, 3).call().then(function(res) {
        //                         depAmount = toBNB(res[0])
        //                         startTime = res[1]
        //                         readableTime = getTime(startTime)
        //                         content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                         VaultsContract.methods.getUserDepositInfo(currentAddr, 4).call().then(function(res) {
        //                             depAmount = toBNB(res[0])
        //                             startTime = res[1]
        //                             readableTime = getTime(startTime)
        //                             content += `<tr><td>${readableTime}</td><td>${depAmount} BNB</td></tr>`
        //                             $("#user-deposits").html(content)
        //                         })
        //                     })
        //                 })
        //             })
        //         })
        //     }
        // })
    }, 2000)
}

function append_html(html) {
    $('#mystake_row').append(html);
}

function invest(plan, qty) {
    console.log('ttttt', plan, qty);
    qty = qty * 1e18;
    if (qty < 0.05 * 1e18) {
        Swal.fire({
            icon: 'error',
            text: 'Amount Must be greater than 0.05!',
        })
        return
    }
    console.log('upline', upline);
    VaultsContract.methods.invest(upline, 0, plan).send({
        value: qty,
        from: currentAddr
    }).on('transactionHash', function(hash) {
        Swal.fire({
            icon: 'info',
            text: 'Transaction: ' + hash,
        })
        console.log(hash)
    }).on('confirmation', function(confirmationNumber, receipt) {
        console.log(confirmationNumber)
    }).on('receipt', function(receipt) {
        console.log("receipt", receipt)
    }).on('error', function(error) {
        console.log("error", error)
    }).catch(e => {
        Swal.fire({
            icon: 'error',
            text: e.message,
        })
    })
}
let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName, i
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=')
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1])
        }
    }
}
let refurl = getUrlParameter('ref')
if (refurl) {
    localStorage.setItem('ref', refurl)
}
upline = localStorage.getItem('ref') ? localStorage.getItem('ref') : referrer
$(function() {
    // $("#invest-button").click(function() {
    //     let qty = $("#invest-input1").val()
    //     invest(qty * 1e18)
    // })
    $("#wdbtn").click(function() {
        VaultsContract.methods.withdraw().send({
            from: currentAddr
        })
    })
    $("#ribtn").click(function() {
        VaultsContract.methods.reinvest().send({
            from: currentAddr
        })
    })
})

function copyToClipboard(element) {
    let $temp = $("<input>")
    $("body").append($temp)
    $temp.val($(element).val()).select()
    document.execCommand("copy")
    $temp.remove()
    Swal.fire({
        icon: 'success',
        text: 'copied',
    })
}

function getTime(time) {
    let date = new Date(time * 1000)
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    if (month < 10) month = '0' + month
    if (minutes < 10) minutes = '0' + minutes
    if (day < 10) day = '0' + day
    if (hours < 10) hours = '0' + hours
    return (`${day}.${month} | ${hours}:${minutes}`)
}

function unixToReadable(time) {
    let now = new Date()
    let diff = time * 1000 - now.getTime()
    if (diff > 0) {
        let delta = Math.abs(diff) / 1000
        let days = Math.floor(delta / 86400)
        delta -= days * 86400
        let hours = Math.floor(delta / 3600) % 24
        delta -= hours * 3600
        let minutes = Math.floor(delta / 60) % 60
        delta -= minutes * 60
        let seconds = (delta % 60).toFixed(0)
        if (hours < 10) {
            hours = '0' + hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        }
        return (`${hours}:${minutes}:${seconds}`)
    } else {
        return ("00:00:00")
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomReferrer() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "/referrer",
            methods: "get",
            dataType: "json",
            success: function(data) {
                if (data.length > 0) {
                    resolve(data[parseInt(getRandom(0, data.length - 1))])
                } else {
                    reject(false)
                }
            },
            error: function(err) {
                reject(false)
            }
        })
    })
}
getRandomReferrer().then(function(randomReferrer) {
    referrer = randomReferrer
    console.log("new referrer:" + randomReferrer)
})




function get_profit(e, t) {

    //console.log('contractPercent1',contractPercent1);
    var n = e;
    a = 0;
    if (
        (0 == t &&
            ((a = (
                    n *
                    (contractPercent0 / 100) *
                    14
                ).toFixed(2)),
                c.render(a, document.getElementById("plan0profit"))),

            // 1 == t &&
            // ((a = (
            //   n *
            //   (this.state.contractPercent1 / 100) *
            //   21
            // ).toFixed(2)),
            //   c.render(a, document.getElementById("plan1profit"))),
            // 2 == t &&
            // ((a = (
            //   n *
            //   (this.state.contractPercent2 / 100) *
            //   28
            // ).toFixed(2)),
            //   c.render(a, document.getElementById("plan2profit"))),
            1 == t)
    ) {
        for (var s = 100, r = 0; r < 7; r++)
            s += s * (contractPercent1 / 100);
        (a = ((n * (s - 100)) / 100).toFixed(2)),
        //console.log('this will be profit i guess', a);
        //   c.render(a, document.getElementById("plan1profit"));
        $('#plan1profit').html(a);
    }
    if (2 == t) {
        for (var i = 100, l = 0; l < 14; l++)
            i += i * (contractPercent2 / 100);
        (a = ((n * (i - 100)) / 100).toFixed(2)),
        // c.render(a, document.getElementById("plan2profit"));
        $('#plan2profit').html(a);
    }
    if (3 == t) {
        for (var o = 100, d = 0; d < 21; d++)
            o += o * (contractPercent3 / 100);
        (a = ((n * (o - 100)) / 100).toFixed(2)),
        // c.render(a, document.getElementById("plan3profit"));
        $('#plan3profit').html(a);
    }
    if (0 == t) {
        for (var o = 100, d = 0; d < 14; d++)
            o += o * (contractPercent0 / 100);
        (a = ((n * (o - 100)) / 100).toFixed(2)),
        $('#plan0rofit').html(a);
    }
}

function refresh_page(valu) {
    if (valu == 1) {

        window.location.reload();
    }
}

window.ethereum.on('accountsChanged', function(accounts) {
    window.location.reload();
})