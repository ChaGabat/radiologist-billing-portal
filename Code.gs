// Project configuration
const CONFIG = {
  projectId: 'fiery-cistern-510801-r5',
  datasetId: 'rrd_incentive',
  tableId: 'rrd_incentive_view'
};

// Main entry point for web requests
function doGet(e) {
  try {
    const action = e.parameter.action;

    // Log the request (optional, helps with debugging)
    Logger.log(`Action: ${action}`);

    switch (action) {
      case 'getRadiologists':
        return getRadiologists();

      case 'getRadiologistSummary':
        return getRadiologistSummary(e.parameter);

      case 'getAdminSummary':
        return getAdminSummary(e.parameter);

      default:
        return createErrorResponse('Invalid action', 400);
    }
  } catch (error) {
    Logger.log(`Error in doGet: ${error.toString()}`);
    return createErrorResponse(`Server error: ${error.toString()}`, 500);
  }
}

/**
 * Fetch distinct radiologists from the table
 */
function getRadiologists() {
  const query = `
    SELECT DISTINCT Local_Radiologist
    FROM \`${CONFIG.projectId}.${CONFIG.datasetId}.${CONFIG.tableId}\`
    WHERE Local_Radiologist IS NOT NULL
    ORDER BY Local_Radiologist ASC
  `;

  try {
    const result = runBigQuery(query);
    const rows = result.rows || [];

    // Extract the radiologist names safely
    const radiologists = rows.map(row => {
      return row.f && row.f[0] && row.f[0].v ? row.f[0].v : null;
    }).filter(r => r !== null);

    return createSuccessResponse(radiologists);
  } catch (error) {
    Logger.log(`Error fetching radiologists: ${error.toString()}`);
    return createErrorResponse('Failed to fetch radiologists', 500);
  }
}

/**
 * Fetch summary data for a specific radiologist within a date range
 */
function getRadiologistSummary(params) {
  const radiologist = params.radiologist || '';
  const startDate = params.startDate || '';
  const endDate = params.endDate || '';

  // Validate input
  const validation = validateDateParams(startDate, endDate);
  if (!validation.isValid) {
    return createErrorResponse(validation.error, 400);
  }

  if (!radiologist || radiologist.trim() === '') {
    return createErrorResponse('Missing radiologist parameter', 400);
  }

  // Use parameterized query to prevent SQL injection
  const query = `
    SELECT
      Time_in_Dictated,
      Modality,
      Study_Description,
      CPT,
      cpt_mods,
      RA,
      User_in_Dictated,
      Local_Radiologist,
      Peer_Review,
      Study_IUID
    FROM \`${CONFIG.projectId}.${CONFIG.datasetId}.${CONFIG.tableId}\`
    WHERE Local_Radiologist = @radiologist
      AND Time_in_Dictated BETWEEN @startDate AND @endDate
    ORDER BY Time_in_Dictated DESC
  `;

  const request = {
    query: query,
    useLegacySql: false,
    queryParameters: [
      {
        name: 'radiologist',
        parameterType: { type: 'STRING' },
        parameterValue: { value: radiologist }
      },
      {
        name: 'startDate',
        parameterType: { type: 'STRING' },
        parameterValue: { value: startDate }
      },
      {
        name: 'endDate',
        parameterType: { type: 'STRING' },
        parameterValue: { value: endDate }
      }
    ]
  };

  try {
    const result = BigQuery.Jobs.query(request, CONFIG.projectId);
    const data = parseBigQueryRows(result.rows || []);
    return createSuccessResponse(data);
  } catch (error) {
    Logger.log(`Error fetching radiologist summary: ${error.toString()}`);
    return createErrorResponse('Failed to fetch radiologist summary', 500);
  }
}

/**
 * Fetch summary data for all radiologists within a date range
 */
function getAdminSummary(params) {
  const startDate = params.startDate || '';
  const endDate = params.endDate || '';

  // Validate input
  const validation = validateDateParams(startDate, endDate);
  if (!validation.isValid) {
    return createErrorResponse(validation.error, 400);
  }

  // Use parameterized query to prevent SQL injection
  const query = `
    SELECT
      Time_in_Dictated,
      Modality,
      Study_Description,
      CPT,
      cpt_mods,
      RA,
      User_in_Dictated,
      Local_Radiologist,
      Peer_Review,
      Study_IUID
    FROM \`${CONFIG.projectId}.${CONFIG.datasetId}.${CONFIG.tableId}\`
    WHERE Time_in_Dictated BETWEEN @startDate AND @endDate
    ORDER BY Local_Radiologist ASC, Time_in_Dictated DESC
  `;

  const request = {
    query: query,
    useLegacySql: false,
    queryParameters: [
      {
        name: 'startDate',
        parameterType: { type: 'STRING' },
        parameterValue: { value: startDate }
      },
      {
        name: 'endDate',
        parameterType: { type: 'STRING' },
        parameterValue: { value: endDate }
      }
    ]
  };

  try {
    const result = BigQuery.Jobs.query(request, CONFIG.projectId);
    const data = parseBigQueryRows(result.rows || []);
    return createSuccessResponse(data);
  } catch (error) {
    Logger.log(`Error fetching admin summary: ${error.toString()}`);
    return createErrorResponse('Failed to fetch admin summary', 500);
  }
}

/**
 * Helper: Parse BigQuery rows into a standard object format
 * Handles null/undefined fields safely
 */
function parseBigQueryRows(rows) {
  const fieldNames = [
    'Time_in_Dictated',
    'Modality',
    'Study_Description',
    'CPT',
    'cpt_mods',
    'RA',
    'User_in_Dictated',
    'Local_Radiologist',
    'Peer_Review',
    'Study_IUID'
  ];

  return rows.map(row => {
    const obj = {};
    fieldNames.forEach((fieldName, index) => {
      const value = row.f && row.f[index] && row.f[index].v !== null ? row.f[index].v : null;
      obj[fieldName] = value;
    });
    return obj;
  });
}

/**
 * Helper: Validate date parameters
 */
function validateDateParams(startDate, endDate) {
  if (!startDate || startDate.trim() === '') {
    return { isValid: false, error: 'Missing startDate parameter' };
  }
  if (!endDate || endDate.trim() === '') {
    return { isValid: false, error: 'Missing endDate parameter' };
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return { isValid: false, error: 'Dates must be in YYYY-MM-DD format' };
  }

  if (startDate > endDate) {
    return { isValid: false, error: 'Start date cannot be later than end date' };
  }

  return { isValid: true };
}

/**
 * Helper: Create a success response
 */
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Create an error response
 */
function createErrorResponse(message, statusCode = 400) {
  const response = { error: message };
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  // Note: Apps Script doesn't allow setting HTTP status codes directly in web apps.
  // Status is always 200, but the error object communicates the issue to the client.
}

/**
 * Helper: Execute BigQuery query (kept simple, error handling is done at call site)
 */



/**
 * Execute a BigQuery query reliably.
 *
 * Requires the Apps Script BigQuery advanced service.
 * Returns all rows up to MAX_QUERY_ROWS.
 * Throws an error rather than returning a partial report.
 */
const MAX_QUERY_ROWS = 10000;
const PAGE_SIZE = 1000;
const QUERY_TIMEOUT_MS = 20000;

function runBigQuery(query, queryParameters) {
  const request = {
    query: query,
    useLegacySql: false,
    parameterMode: 'NAMED',
    queryParameters: queryParameters || [],
    timeoutMs: QUERY_TIMEOUT_MS,
    maxResults: PAGE_SIZE
  };

  let result = BigQuery.Jobs.query(request, CONFIG.projectId);

  if (!result.jobReference || !result.jobReference.jobId) {
    if (result.errors && result.errors.length) {
      throw new Error('BigQuery query failed.');
    }

    if (result.jobComplete === true) {
      return result;
    }

    throw new Error('BigQuery did not return a query job ID.');
  }

  const jobId = result.jobReference.jobId;
  const location = result.jobReference.location || result.location;

  let delayMs = 500;
  const deadline = Date.now() + 180000;

  // Wait for query completion.
  while (result.jobComplete !== true) {
    if (Date.now() >= deadline) {
      throw new Error('BigQuery query timed out.');
    }

    Utilities.sleep(delayMs);
    delayMs = Math.min(delayMs * 2, 5000);

    const options = { timeoutMs: QUERY_TIMEOUT_MS };
    if (location) options.location = location;

    result = BigQuery.Jobs.getQueryResults(
      CONFIG.projectId,
      jobId,
      options
    );
  }

  // Check the completed job for a fatal execution error.
  const job = location
    ? BigQuery.Jobs.get(CONFIG.projectId, jobId, { location: location })
    : BigQuery.Jobs.get(CONFIG.projectId, jobId);

  if (job.status && job.status.errorResult) {
    Logger.log('BigQuery job failed: ' +
      JSON.stringify(job.status.errorResult));
    throw new Error('BigQuery query execution failed.');
  }

  let rows = result.rows ? result.rows.slice() : [];
  let pageToken = result.pageToken;

  while (pageToken) {
    if (Date.now() >= deadline) {
      throw new Error('BigQuery result retrieval timed out.');
    }

    const options = {
      pageToken: pageToken,
      maxResults: PAGE_SIZE
    };
    if (location) options.location = location;

    const page = BigQuery.Jobs.getQueryResults(
      CONFIG.projectId,
      jobId,
      options
    );

    if (page.jobComplete !== true) {
      throw new Error('BigQuery results are not complete.');
    }

    const nextRows = page.rows || [];

    if (rows.length + nextRows.length > MAX_QUERY_ROWS) {
      throw new Error(
        'Report exceeds the maximum of ' +
        MAX_QUERY_ROWS +
        ' rows. Narrow the date range or use paginated reports.'
      );
    }

    rows = rows.concat(nextRows);
    pageToken = page.pageToken;
  }

  if (rows.length > MAX_QUERY_ROWS) {
    throw new Error(
      'Report exceeds the maximum permitted row count.'
    );
  }

  result.rows = rows;
  return result;
}




/*
function runBigQuery(query) {
  const request = {
    query: query,
    useLegacySql: false
  };

  return BigQuery.Jobs.query(request, CONFIG.projectId);
}
*/
