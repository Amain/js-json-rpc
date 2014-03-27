js-json-rpc
===========

Client-side javascript implementation of JSON RPC 2.0 relying on JQuery Ajax functions. Benefitting from JQuery's execelent quality of its Ajax implementation, and easy syntax for calling remote procedures. Note that there is currently no support for batches and notifications. This may be added later when needed. JSON RPC is simple, can be easily understood and provides a standard mechanism using JSON for calling remote methods. Small deviation exists where, contrary to the specification, the result may contains both a error and result object. This to be compatible with server implementations that respond in this fashion.

Example usage
=============

    $.jsonrpcSetup({
        url: '/api/api.php',
        error: function( xhr, status, error ) {
            console.log( "Error in request without error handler: " + status + "> " + error );
        }
    });

    $.jsonrpc(
        'GetStatus', [], {
            success: function( status ) {
                $('#statusInternet').text( status.internet );
                $('#statusAccessPoint').text( status.ap );
                $('#statusFirewall').text( status.firewall );
            },
        }
    );
