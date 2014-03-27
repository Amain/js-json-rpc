/**
 * JQuery based JSON-RPC 2.0 Client for Javascript version 1.0
 *
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Johan van Zoomeren
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.

 * Changelog:
 *
 * [Date]     [Name]              [Desciption]
 * 2014/03/27 Johan van Zoomeren  Version 1.0
 *
 */
 
$.jsonrpc_last_msg_id = 0;

$.jsonrpcSetup = function( options ) 
{
  $.ajaxSetup( options );
}

$.jsonrpc = function( method, params, options ) 
{
    // Force options to be an object
    options = options || {};

    // Create the JSON-RPC 2.0 request body
    var body = {
      jsonrpc: '2.0',
      method : method,
      params : params,
      id     : ++$.jsonrpc_last_msg_id
    };

    // Store original success handler
    var success = options.success;

    // Handle JSON-RPC 2.0 reply
    options.success = function( reply ) {

      var aSucHandlers = [ success      , $.ajaxSettings.success, function() {} ];
      var aErrHandlers = [ options.error, $.ajaxSettings.error  , function() {} ];

      if ( 'result'  in reply    &&
         'error'   in reply    &&
         'id'      in reply    &&
         reply.result !== null &&
         reply.id     !== null &&
         reply.error  === null    )
      {
        for( var f in aSucHandlers ) 
        {
          var fHandler = aSucHandlers[ f ];

          if ( typeof fHandler === 'function' ) 
          {
            fHandler( reply.result );
            break;
          }
        }
      }
      else
      {
        for( var f in aErrHandlers ) 
        {
          var fHandler = aErrHandlers[ f ];

          if ( typeof fHandler === 'function' ) 
          {
            if ( 'result'  in reply    &&
               'error'   in reply    &&
               'id'      in reply    &&
               reply.result === null &&
               reply.id     !== null &&
               reply.error  !== null    ) 
            {
              fHandler( null, 'jsonrpc-reply-error', reply.error );
            } else 
            {
              fHandler( null, 'jsonrpc-reply-invalid', null );
            }

            break;
          }
        }
      }
    }

    // Create the JSON-RPC 2.0 request
    options.type        = 'POST';
    options.contentType = 'application/json';
    options.data        = $.toJSON( body );
    options.dataType    = 'json';
    options.cache       = false;

    // Use JQuery handle the ajax request
    return $.ajax( options );
}
