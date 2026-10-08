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
function runBigQuery(query) {
  const request = {
    query: query,
    useLegacySql: false
  };

  return BigQuery.Jobs.query(request, CONFIG.projectId);
}
